import { fetchRedirectUrl } from "@/services/asm-api/mutations/on-server/redirect";
import { Content } from "./content";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const res = await fetchRedirectUrl(searchParams.ref_id as string);

  return <Content url={res.redirectUrl} />;
}
