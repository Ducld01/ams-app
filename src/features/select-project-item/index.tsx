"use client";

import { Project } from "@/app/types";
import { ASM_ORIGIN } from "@/config";
import { TFetchCampaigns } from "@/services/asm-api/mutations/on-server/projects";
import { Select, SelectProps } from "antd";
import { useEffect, useState } from "react";

export type ProjectOption = {
  lable: string;
  value: string;
};

export const SelectProjectItem = ({
  ...props
}: Omit<
  SelectProps,
  "showSearch" | "filterOption" | "placeholder" | "options"
>) => {
  const [listProject, setListProject] = useState<Project[]>([]);
  const [qrParams, setQrParams] = useState<{ name: string }>({ name: "" });

  const handleSearch = (value: string) => {
    setQrParams({ name: value });
  };

  useEffect(() => {
    const fetchRefs = async () => {
      try {
        const response = await fetch(
          `${ASM_ORIGIN}/api/projects${qrParams.name ? `?name=${qrParams.name}` : ""}`
        );
        const data: TFetchCampaigns = await response.json();

        setListProject(data.data);
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
      options={listProject.map((project) => ({
        label: project.name,
        value: project.id,
      }))}
    />
  );
};
