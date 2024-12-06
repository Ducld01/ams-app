import { asmApiIns } from "../api-ins";

export const fetchRedirectUrl = (ref_id: string) =>
  asmApiIns({ path: `redirect/${ref_id}` })
    .get()
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch redirect url");
      }

      return res.json();
    });
