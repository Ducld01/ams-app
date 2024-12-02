import { Metadata } from "next";
import { CreateCampaignForm } from "./_sections";
import { Campaign } from "@/app/types";

export const metadata: Metadata = {
  title: "Thêm Chiến dịch mới",
};

export default function AddCampaignPage() {
  async function handleSubmit(
    data: Pick<Campaign, "name" | "code" | "project_id">
  ) {
    "use server";
    await fetch("http://localhost:3000/api/campaigns", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }
  return <CreateCampaignForm onSubmit={handleSubmit} />;
}
