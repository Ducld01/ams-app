import "server-only";

import qs from "qs";
import { cookies } from "next/headers";
import { HTTP_HEADERS } from "../constants/http";
import { concatBaseURLAndPath } from "./url";

type FetcherConfig = {
  path: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  qrParams?: Record<string, any>;
  headers?: HeadersInit;
};

type RequestConfig = {
  headers?: HeadersInit;
};

export const createFetcher =
  (baseURL: string) =>
  ({ path, qrParams, headers }: FetcherConfig) => {
    const strParams = qrParams
      ? qs.stringify(qrParams, { arrayFormat: "brackets" })
      : "";
    const url = `${concatBaseURLAndPath(baseURL, path)}${
      strParams ? `/?${strParams}` : ""
    }`;

    const token = cookies().get("token");

    const baseHeaders = {
      [HTTP_HEADERS.ContentType]: "application/json",
      ...(token ? { Authorization: `Bearer ${token.value}` } : {}),
      ...headers,
    };

    console.log(url);

    return {
      get: (reqCfg?: RequestConfig) =>
        fetch(url, {
          method: "GET",
          headers: {
            ...baseHeaders,
            ...reqCfg?.headers,
          },
        }),
      post<T>(
        reqCfg?: RequestConfig & {
          body?: T;
        }
      ) {
        return fetch(url, {
          method: "POST",
          headers: {
            ...baseHeaders,
            ...reqCfg?.headers,
          },
          body: reqCfg?.body ? JSON.stringify(reqCfg.body) : null,
        });
      },

      put<T>(
        reqCfg?: RequestConfig & {
          body?: T;
        }
      ) {
        return fetch(url, {
          method: "PUT",
          headers: {
            ...baseHeaders,
            ...reqCfg?.headers,
          },
          body: reqCfg?.body ? JSON.stringify(reqCfg.body) : null,
        });
      },
      delete<T>(
        reqCfg?: RequestConfig & {
          body?: T;
        }
      ) {
        return fetch(url, {
          method: "DELETE",
          headers: {
            ...baseHeaders,
            ...reqCfg?.headers,
          },
          body: reqCfg?.body ? JSON.stringify(reqCfg.body) : null,
        });
      },
    };
  };
