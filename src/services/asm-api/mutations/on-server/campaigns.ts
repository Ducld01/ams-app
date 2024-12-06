import { Campaign } from "@/app/types";
import { asmApiIns } from "../api-ins";

export type TFetchCampaigns = {
  data: Campaign[];
};

export const getAllCampaign = async () =>
  asmApiIns({ path: "campaigns" })
    .get()
    .then(async (response) => {
      if (!response.ok) {
        throw new Error("failed to get Projects");
      }
      const data: TFetchCampaigns = await response.json();

      return data;
    });

export const createCampaign = async (
  campaign: Pick<Campaign, "name" | "code" | "project_id">
) => {
  return asmApiIns({ path: "campaigns" }).post({ body: campaign });
};
