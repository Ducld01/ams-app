import type { Metadata } from "next";
import { ListRefTable } from "./_sections";
import { Refs } from "../types";

export type TFetchRefs = {
  data: Refs[];
};

export const metadata: Metadata = {
  title: "Danh sách Ref",
};

export default async function RefPage() {
  const res = await fetch("http://localhost:3000/api/refs");
  const repo: TFetchRefs = await res.json();
  return <ListRefTable data={repo.data} />;
}
