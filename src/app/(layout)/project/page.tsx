import { Metadata } from "next";
import { ProjectList } from "./_sections";
import { Project as TProJect } from "../../types";
import { getAllProject } from "@/services/asm-api/mutations/on-server/projects";

export type TFetchProject = {
  data: TProJect[];
};

export const metadata: Metadata = {
  title: "Danh sách dự án",
};

export default async function Project() {
  const res = await getAllProject();

  return <ProjectList data={res.data} />;
}
