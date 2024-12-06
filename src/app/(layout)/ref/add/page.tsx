import { Metadata } from "next";
import { CreateRefForm } from "./_sections";
import { Refs } from "@/app/types";
import { createRef } from "@/services/asm-api/mutations/on-server/refs";

export const metadata: Metadata = {
  title: "Thêm mới Ref",
};

export default function AddLinkRef() {
  async function handleSubmit(data: Pick<Refs, "name" | "url">) {
    "use server";
    await createRef(data);
  }
  return <CreateRefForm onSubmit={handleSubmit} />;
}
