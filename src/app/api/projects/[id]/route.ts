import Database from "better-sqlite3";
import { NextResponse, NextRequest } from "next/server";
import path from "path";

const db = new Database(path.join(process.cwd(), "database.db"));

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
console.log(id);

  try {
    const stmt = db.prepare("SELECT * FROM projects WHERE id = ?");
    const projectDetail = stmt.get(id);

    if (!projectDetail) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    console.log(projectDetail);

    return NextResponse.json(projectDetail, { status: 200 });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
