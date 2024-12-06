import { fetchRedirectUrl } from "@/services/asm-api/mutations/on-server/redirect";
import { Content } from "../content";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const res = await fetchRedirectUrl((await params).id as string);

  return <Content url={res.redirectUrl} />;
}
