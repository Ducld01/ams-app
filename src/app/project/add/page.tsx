import { Metadata } from "next";
import { AddProjectForm } from "./_sections";

export const metadata: Metadata = {
  title: "Thêm dự án mới",
};

export default function AddProjectPage() {

  return <AddProjectForm />;
}
