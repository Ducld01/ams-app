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
    return NextResponse.json(
      { message: "ref saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving ref:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const refs = db.prepare("SELECT * FROM refs").all();

    console.log(refs);

    return NextResponse.json({ data: refs }, { status: 200 });
  } catch (error) {
    console.error("Error fetching refs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
