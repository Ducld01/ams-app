import { Metadata } from "next";
import { AddProjectForm } from "./_sections";
import { createProject } from "@/services/asm-api/mutations/on-server/projects";
import { Project } from "@/app/types";

export const metadata: Metadata = {
  title: "Thêm dự án mới",
};

export default function AddProjectPage() {
  async function handleSubmit(data: Project) {
    "use server";
    await createProject(data);
  }

  return <AddProjectForm onSubmit={handleSubmit}/>;
}
