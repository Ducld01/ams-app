import { Project } from "@/app/types";
import { asmApiIns } from "../api-ins";

export type TFetchCampaigns = {
  data: Project[];
};

export const getAllProject = async (qrParams?: { name: string }) =>
  asmApiIns({ path: "projects", qrParams })
    .get()
    .then(async (response) => {
      if (!response.ok) {
        throw new Error("failed to get Projects");
      }
      const data: TFetchCampaigns = await response.json();

      return data;
    });

export const getProjectById = async (id: string) =>
  asmApiIns({ path: `projects/${id}` })
    .get()
    .then(async (response) => {
      if (!response.ok) {
        throw new Error("failed to get Project");
      }
      const data: Project = await response.json();

      return data;
    });

export const createProject = async (data: Project) => {
  return asmApiIns({ path: "projects" })
    .post({ body: data })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error("failed to create Project");
      }

      return data;
    });
};
