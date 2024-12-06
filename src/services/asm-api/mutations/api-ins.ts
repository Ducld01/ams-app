import { ASM_ORIGIN } from "@/config";
import { createFetcher } from "@/shared/utils/fetch-helper";
import { concatBaseURLAndPath } from "@/shared/utils/url";

export const asmApiIns = createFetcher(
  concatBaseURLAndPath(ASM_ORIGIN, "api/")
);
