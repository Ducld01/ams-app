import path from "path";
import Database from "better-sqlite3";

import { NextResponse } from "next/server";
import { Refs } from "@/app/types";

const db = new Database(path.join(process.cwd(), "database.db"));

db.prepare(
  `
    CREATE TABLE IF NOT EXISTS refs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      url TEXT,
      created_at TEXT
    );
  `
).run();

export async function POST(request: Request) {
  try {
    const data: Refs = await request.json();

    const stmt = db.prepare(`
        INSERT INTO refs (name, url, created_at)
        VALUES (?, ?, ?)
      `);
    stmt.run(data.name, data.url, new Date().toISOString());
    return NextResponse.redirect("/ref");
  } catch (error) {
    console.error("Error saving ref:", error);
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

    let query = "SELECT * FROM refs";
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
    const refs = stmt.all(...values);

    return NextResponse.json({ data: refs }, { status: 200 });
  } catch (error) {
    console.error("Error fetching refs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
