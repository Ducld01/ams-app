"use client";
import { Refs } from "@/app/types";
import { ASM_ORIGIN } from "@/config";
import { Select, SelectProps } from "antd";
import { useEffect, useState } from "react";

export type RefOption = {
  label: string;
  value: string;
  url: string;
};

export const SelectRefItem = ({
  ...props
}: Omit<
  SelectProps,
  "showSearch" | "filterOption" | "placeholder" | "options"
>) => {
  const [listRef, setListRef] = useState<Refs[]>([]);
  const [qrParams, setQrParams] = useState<{ name: string }>({ name: "" });

  const handleSearch = (value: string) => {
    setQrParams({ name: value });
  };

  useEffect(() => {
    const fetchRefs = async () => {
      try {
        const response = await fetch(
          `${ASM_ORIGIN}/api/refs${qrParams.name ? `?name=${qrParams.name}` : ""}`
        );
        const data = await response.json();

        setListRef(data.data);
      } catch (error) {
        console.error("Error fetching refs:", error);
      }
    };
    fetchRefs();
  }, [qrParams.name]);

  return (
    <Select
      {...props}
      showSearch
      filterOption={false}
      placeholder="Select a ref"
      onSearch={(value) => handleSearch(value)}
      options={listRef.map((ref) => ({
        label: ref.name,
        value: ref.id,
        url: ref.url,
      }))}
    />
  );
};
