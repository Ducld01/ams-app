import path from "path";
import Database from "better-sqlite3";

import { NextResponse } from "next/server";
import { Project } from "@/app/types";

const db = new Database(path.join(process.cwd(), "database.db"));

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    status TEXT,
    created_at TEXT,
    type TEXT
  );
`
).run();

db.prepare(
  `CREATE TABLE IF NOT EXISTS redirect_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  active BOOLEAN,
  probability REAL,
  offerId TEXT,
  redirectProfileName TEXT,
  url TEXT,
  key TEXT,
  condition_type TEXT,
  project_id INTEGER,
  FOREIGN KEY (project_id) REFERENCES projects(id)
);`
).run();

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS redirect_conditions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  valueCondition TEXT,
  reference_type TEXT,
  reference_action TEXT,
  redirect_profile_id INTEGER,
  FOREIGN KEY (redirect_profile_id) REFERENCES redirect_profiles(id)
);
  `
).run();

// const filePath = path.join(process.cwd(), "app", "data.json");

export async function POST(request: Request) {
  try {
    const data: Project = await request.json();

    const checkProjectExists = db.prepare(`
      SELECT COUNT(*) as count FROM projects WHERE name = ?
    `);
    const { count } = checkProjectExists.get(data.name) as { count: number };

    if (count > 0) {
      return NextResponse.json(
        { error: "Project name already exists" },
        { status: 400 }
      );
    }

    const insertProject = db.prepare(`
      INSERT INTO projects (name, status, created_at, type)
      VALUES (?, ?, ?, ?)
    `);

    const insertRedirectProfile = db.prepare(`
      INSERT INTO redirect_profiles (
        active, probability, offerId, redirectProfileName, url, key, condition_type, project_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertRedirectCondition = db.prepare(
      `INSERT INTO redirect_conditions (valueCondition, reference_type, reference_action, redirect_profile_id) VALUES (?, ?, ?, ?)`
    );

    const transaction = db.transaction(() => {
      // Insert project and get the project ID
      const result = insertProject.run(
        data.name,
        data.status === "active" ? "active" : "not_active",
        new Date().toISOString(),
        "Bọc link và chuyển hướng"
      );

      const projectId = result.lastInsertRowid;

      // Insert redirectProfiles linked to the project
      if (data.redirectProfiles && data.redirectProfiles.length > 0) {
        for (const profile of data.redirectProfiles) {
          const profileResult = insertRedirectProfile.run(
            profile.active ? "active" : "not_active",
            profile.probability,
            profile.offerId,
            profile.redirectProfileName,
            profile.url,
            profile.key,
            profile.condition_type,
            projectId
          );

          const profileId = profileResult.lastInsertRowid;

          // If redirectConditions exists for this profile, insert them
          if (
            profile.redirectConditions &&
            profile.redirectConditions.length > 0
          ) {
            for (const condition of profile.redirectConditions) {
              insertRedirectCondition.run(
                condition.valueCondition,
                condition.reference_type,
                condition.reference_action,
                profileId
              );
            }
          }
        }
      }

      return projectId; //
    });

   const project = transaction();

    return NextResponse.json({ data: project }, { status: 200 });
  } catch (error) {
    console.error("Error saving project:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const params = new URLSearchParams(url.searchParams);

    let query = "SELECT * FROM projects";
    const conditions: string[] = [];
    const values: (string | number)[] = [];

    params.forEach((value, key) => {
      if (key === "name") {
        conditions.push(`${key} LIKE ?`);
        values.push(`%${value}%`); // Add wildcards for partial matching
      } else {
        conditions.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    const stmt = db.prepare((query += " ORDER BY created_at DESC"));
    const projects = stmt.all(...values);

    return NextResponse.json({ data: projects }, { status: 200 });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    // Start a transaction to ensure atomic deletion
    const transaction = db.transaction(() => {
      // Delete all redirect conditions
      db.prepare(`DELETE FROM redirect_conditions`).run();

      // Delete all redirect profiles
      db.prepare(`DELETE FROM redirect_profiles`).run();

      // Delete all projects
      db.prepare(`DELETE FROM projects`).run();
    });

    // Execute the transaction
    transaction();

    return NextResponse.json(
      { message: "All projects and related data deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting all projects:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
