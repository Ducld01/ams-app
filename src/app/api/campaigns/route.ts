import path from "path";
import Database from "better-sqlite3";

import { NextResponse } from "next/server";
import { Campaign } from "@/app/types";

const db = new Database(path.join(process.cwd(), "database.db"));

db.prepare(
  `
    CREATE TABLE IF NOT EXISTS campaigns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      status TEXT,
      created_at TEXT,
      script TEXT,
        time_zone TEXT,
        project_id TEXT,
        code TEXT
    );
  `
).run();

export async function POST(request: Request) {
  try {
    const data: Campaign = await request.json();

    const stmt = db.prepare(`
        INSERT INTO campaigns (name,  created_at,  project_id, code)
        VALUES (?, ?, ?, ?)
      `);
    stmt.run(data.name, new Date().toISOString(), data.project_id, data.code);
    return NextResponse.json(
      { message: "Campaign saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving Campaignv:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
