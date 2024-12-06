import { Metadata } from "next";
import { CampaignList } from "./_section";
import { getAllCampaign } from "@/services/asm-api/mutations/on-server/campaigns";
import { Campaign } from "@/app/types";

export type TFetchCampaigns = {
    data: Campaign[];
  }
  
  export const metadata: Metadata = {
    title: "Danh sách chiến dịch",
  };
  
  
  export default async function Project() {
    const res = await getAllCampaign()
    return <CampaignList data={res.data}/>;
  }