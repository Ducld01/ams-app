import { ASM_ORIGIN } from "@/config";
import {
  generateSelfDeObfuscatingAndRunningCodeStr,
  obfuscator,
} from "@/shared/utils/obfuscator";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const params = new URLSearchParams(url.searchParams);

    const ref_id = params.get("ref_id") as string;
    const campaign_id = params.get("campaign_id") as string;

    const script = `const CAMPAIGN_ID = ${JSON.stringify(
        campaign_id
    )}; const TRACKING = ${JSON.stringify(
      ASM_ORIGIN + "/api/redirect?ref_id=" + ref_id
    )}; function main() { var found = false; const campaignIterator = AdsApp.campaigns().get(); while (campaignIterator.hasNext()) { var campaign = campaignIterator.next(); console.log(\`Name: "\${campaign.getName()}", ID: \${campaign.getId()}\`); if (campaign.getId() == CAMPAIGN_ID) { found = true; break; } } if (found) { campaign.urls().setTrackingTemplate(TRACKING); } }`;

    const obScript = generateSelfDeObfuscatingAndRunningCodeStr(
      obfuscator(script)
    );

    return NextResponse.json( obScript , { status: 200 });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
