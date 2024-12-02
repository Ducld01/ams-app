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

// const filePath = path.join(process.cwd(), "app", "data.json");

export async function POST(request: Request) {
  try {
    const data: Project = await request.json();

    const stmt = db.prepare(`
      INSERT INTO projects (name, status, created_at, type)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(
      data.name,
      data.status ? "active" : "not_active",
      new Date().toISOString(),
      "Bọc link và chuyển hướng"
    );

    return NextResponse.json(
      { message: "Project saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving project:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const projects = db.prepare("SELECT * FROM projects").all();

    console.log(projects);

    return NextResponse.json({ data: projects }, { status: 200 });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
