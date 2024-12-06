import path from "path";
import Database from "better-sqlite3";
import { NextResponse } from "next/server";

const db = new Database(path.join(process.cwd(), "database.db"));

export async function GET() {
    try {
      const redirect_conditions = db.prepare("SELECT * FROM redirect_conditions").all();
  
      return NextResponse.json({ data: redirect_conditions }, { status: 200 });
    } catch (error) {
      console.error("Error fetching projects:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }