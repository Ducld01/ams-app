import { Metadata } from "next";
import { ProjectList } from "./_sections";
import { Project as TProJect } from "../types";

export type TFetchProject = {
  data: TProJect[];
}

export const metadata: Metadata = {
  title: "Danh sách dự án",
};


export default async function Project() {
  const res = await fetch('http://localhost:3000/api/projects')
  const repo: TFetchProject = await res.json()
  return <ProjectList data={repo.data}/>;
}
