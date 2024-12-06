import { Refs } from "@/app/types";
import { asmApiIns } from "../api-ins";

export type TFetchRefParams = {
  name?: string;
};

export type TFetchRefRes = {
  data: Refs[];
};

export const getAllRef = async (qrParams?: TFetchRefParams) =>
  asmApiIns({ path: "refs", qrParams })
    .get()
    .then(async (response) => {
      if (!response.ok) {
        throw new Error("failed to get");
      }
      const data: TFetchRefRes = await response.json();

      return data;
    });

export const createRef = async (data: Pick<Refs, "name" | "url">) =>
  asmApiIns({ path: "refs" }).post({ body: data });
