import { Metadata } from "next";
import { ProjectDetailForm } from "./_sections";
import { Project } from "@/app/types";

export const metadata: Metadata = {
  title: "Chi tiết dự án",
};

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {

  const projectId = (await params).id;
  const res = await fetch(`http://localhost:3000/api/projects/${projectId}`)
  const projectDetail: Project = await res.json()

  return <ProjectDetailForm data={projectDetail} />;
}
