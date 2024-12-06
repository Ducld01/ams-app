import { Campaign, RedirectProfile } from "@/app/types";
import Database from "better-sqlite3";
import { NextResponse, NextRequest } from "next/server";
import path from "path";

const db = new Database(path.join(process.cwd(), "database.db"));

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const projectId = url.pathname.split("/").pop();

  try {
    // Fetch the project details
    const projectStmt = db.prepare(`
      SELECT * FROM projects WHERE id = ?
    `);
    const project = projectStmt.get(projectId);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Fetch redirectProfiles for the project
    const redirectProfilesStmt = db.prepare(`
      SELECT * FROM redirect_profiles WHERE project_id = ?
    `);
    const redirectProfiles = redirectProfilesStmt.all(
      projectId
    ) as RedirectProfile[];

    // Fetch redirectConditions for all redirectProfiles
    const redirectConditionsStmt = db.prepare(`
      SELECT * FROM redirect_conditions WHERE redirect_profile_id = ?
    `);

    // Add redirectConditions to each redirectProfile
    const detailedRedirectProfiles = redirectProfiles.map((profile) => {
      const redirectConditions = redirectConditionsStmt.all(profile.id);
      return {
        ...profile,
        active: !!profile.active, // Convert SQLite BOOLEAN to JS boolean
        redirectConditions,
      };
    });

    // Fetch campaigns for the project
    const campaignsStmt = db.prepare(`
      SELECT * FROM campaigns WHERE project_id = ?
    `);
    const campaigns = campaignsStmt.all(projectId) as Campaign[];

    // Combine project data with its redirectProfiles
    const response = {
      ...project,
      redirectProfiles: detailedRedirectProfiles,
      campaigns,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching project details:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const UPDATE = async (request: NextRequest) => {
  const url = new URL(request.url);
  const projectId = url.pathname.split("/").pop();

  try {
    // Fetch project details from the database
    const projectStmt = db.prepare("SELECT * FROM projects WHERE id = ?");
    const project = projectStmt.get(projectId);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Parse the request body to get updated project data
    const data = await request.json();
    const updatedProject = {
      ...project,
      ...data, // Merge the existing project with the new data from the request
    };

    // Update the project in the database
    const updateProjectStmt = db.prepare(`
      UPDATE projects 
      SET name = ?, code = ?, type = ?, status = ?, created_at = ?
      WHERE id = ?
    `);
    updateProjectStmt.run(
      updatedProject.name,
      updatedProject.code,
      updatedProject.type,
      updatedProject.status,
      new Date().toISOString(),
      updatedProject.id
    );

    // Insert campaigns into the database if provided in the request
    if (data.campaign && data.campaign.length > 0) {
      const insertCampaignStmt = db.prepare(`
        INSERT INTO campaigns (key, name, status, created_at, time_zone, script, project_id, code)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      data.campaign.forEach((campaign: Campaign) => {
        insertCampaignStmt.run(
          campaign.key,
          campaign.name,
          campaign.status,
          campaign.created_at,
          campaign.time_zone,
          campaign.script,
          updatedProject.id, // Insert the project_id to associate the campaign with the project
          campaign.code
        );
      });
    }

    // Fetch the updated project and campaigns
    const updatedCampaignsStmt = db.prepare(
      "SELECT * FROM campaigns WHERE project_id = ?"
    );
    const updatedCampaigns = updatedCampaignsStmt.all(updatedProject.id);

    return NextResponse.json(
      {
        message: "Project and campaigns updated successfully",
        project: updatedProject,
        campaigns: updatedCampaigns,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating project and campaigns:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
