import path from "path";
import Database from "better-sqlite3";

import { NextResponse } from "next/server";
import { Refs } from "@/app/types";

const db = new Database(path.join(process.cwd(), "database.db"));

export async function GET(request: Request, { params }: { params: { ref_id: string } }) {
  const ref_id = params.ref_id;

  try {
    const refsStmt = db.prepare("SELECT * FROM refs WHERE id = ?");
    const refInfo: Refs = refsStmt.get(ref_id) as Refs;

    if (!refInfo) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    return NextResponse.json({ redirectUrl: refInfo.url }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
