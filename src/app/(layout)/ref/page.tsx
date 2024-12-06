import type { Metadata } from "next";

import { ListRefTable } from "./_sections";
import { Refs } from "../../types";
import { getAllRef } from "../../../services/asm-api/mutations/on-server/refs";

export type TFetchRefs = {
  data: Refs[];
};

export const metadata: Metadata = {
  title: "Danh sách Ref",
};

export default async function RefPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const res = await getAllRef(searchParams);
  
  return <ListRefTable data={res.data} />;
}
