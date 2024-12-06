import path from "path";
import Database from "better-sqlite3";

import { NextResponse } from "next/server";
import { Campaign } from "@/app/types";
import { ASM_ORIGIN } from "@/config";
import {
  generateSelfDeObfuscatingAndRunningCodeStr,
  obfuscator,
} from "@/shared/utils/obfuscator";

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
        INSERT INTO campaigns (name,  created_at,  project_id, code, script)
        VALUES (?, ?, ?, ?, ?)
      `);

    const projectInfo = db
      .prepare("SELECT * FROM projects WHERE id = ?")
      .get(data.project_id);

    if (!projectInfo) {
      return NextResponse.json({ error: "Project not found" }, { status: 500 });
    }

    const checkCodeExists = db.prepare(`
      SELECT COUNT(*) as count FROM campaigns WHERE code = ?
    `);
    const { count } = checkCodeExists.get(data.code) as { count: number };

    if (count > 0) {
      return NextResponse.json(
        { error: "Campaign code already exists" },
        { status: 400 }
      );
    }

    const script = `const CAMPAIGN_ID = ${JSON.stringify(
      data.code
    )}; const TRACKING = ${JSON.stringify(
      "https://ant.design/components/table" + "/?ref_id=1&source_id={network}&creative_id={creative}&campaign_id={campaignid}&creative_set_id={adgroupid}&placement_id={placement}&keyword={keyword}&feeditemid={feeditemid}&targetid={targetid}&loc_interest_ms={loc_interest_ms}&loc_physical_ms={loc_physical_ms}&matchtype={matchtype}&device={device}&devicemodel={devicemodel}&target={target}&desturl={lpurl}"
    )};  var found = false; const campaignIterator = AdsApp.campaigns().get(); while (campaignIterator.hasNext()) { var campaign = campaignIterator.next(); console.log(\`Name: "\${campaign.getName()}", ID: \${campaign.getId()}\`); if (campaign.getId() == CAMPAIGN_ID) { found = true; break; } } if (found) { campaign.urls().setTrackingTemplate(TRACKING); } `;



    stmt.run(
      data.name,
      new Date().toISOString(),
      data.project_id,
      data.code,
      generateSelfDeObfuscatingAndRunningCodeStr(obfuscator(script))
    );
    return NextResponse.json(
      { script },
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

export async function GET() {
  try {
    const campaigns = db.prepare("SELECT * FROM campaigns").all();

    return NextResponse.json({ data: campaigns }, { status: 200 });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
