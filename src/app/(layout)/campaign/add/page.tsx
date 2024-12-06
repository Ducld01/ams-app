import { Metadata } from "next";
import { CreateCampaignForm } from "./_sections";
import { Campaign } from "@/app/types";
import { createCampaign } from "@/services/asm-api/mutations/on-server/campaigns";

export const metadata: Metadata = {
  title: "Thêm Chiến dịch mới",
};

export default function AddCampaignPage() {
  async function handleSubmit(
    data: Pick<Campaign, "name" | "code" | "project_id">
  ) {
    "use server";
    await createCampaign(data);
  }
  return <CreateCampaignForm onSubmit={handleSubmit} />;
}
