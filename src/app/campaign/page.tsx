import { Metadata } from "next";
import { Campaign } from "../types";
import { CampaignList } from "./_section";

export type TFetchCampaigns = {
    data: Campaign[];
  }
  
  export const metadata: Metadata = {
    title: "Danh sách chiến dịch",
  };
  
  
  export default async function Project() {
    const res = await fetch('http://localhost:3000/api/campains')
    const repo: TFetchCampaigns = await res.json()
    return <CampaignList data={repo.data}/>;
  }