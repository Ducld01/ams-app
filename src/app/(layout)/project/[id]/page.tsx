
import { Metadata } from "next";
import { ProjectDetailForm } from "./_sections";
import { getProjectById } from "@/services/asm-api/mutations/on-server/projects";
import { createCampaign } from "@/services/asm-api/mutations/on-server/campaigns";
import { Campaign } from "@/app/types";
import { useRouter } from "next/router";

export const metadata: Metadata = {
  title: "Chi tiết dự án",
};

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const res = await getProjectById((await params).id);

  async function handleCreateCampaign(
    data: Pick<Campaign, "name" | "code" | "project_id">
  ) {
    "use server";
    await createCampaign({
      name: data.name,
      code: data.code,
      project_id: data.project_id,
    });
  }

  return (
    <ProjectDetailForm data={res} onCreateCampaign={handleCreateCampaign} />
  );
}
