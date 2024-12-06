"use client";

import { Project } from "@/app/types";
import { FormInstance, Select, SelectProps, Spin } from "antd";
import { debounce } from "lodash-es";
import { useMemo, useRef, useState } from "react";
import { CampaignField } from "..";

export interface DebounceSelectProps<
  ValueType = { key?: string; label: string; value: string }
> extends Omit<SelectProps<ValueType | ValueType[]>, "options" | "children"> {
  fetchOptions: (search: string) => Promise<ValueType[]>;
  debounceTimeout?: number;
}

export interface DebounceSelectProps<
  ValueType = { key?: string; label: string; value: string }
> extends Omit<SelectProps<ValueType | ValueType[]>, "options" | "children"> {
  fetchOptions: (search: string) => Promise<ValueType[]>;
  debounceTimeout?: number;
}

function DebounceSelect<
  ValueType extends {
    key?: string;
    label: string;
    value: string;
  } = { key?: string; label: string; value: string }
>({
  fetchOptions,
  debounceTimeout = 800,
  ...props
}: DebounceSelectProps<ValueType>) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<ValueType[]>([]);
  const fetchRef = useRef(0);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);

      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }

        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      options={options}
    />
  );
}

interface ProJectValue {
  label: string;
  value: string;
}

async function fetchProjectList(username: string): Promise<ProJectValue[]> {
  console.log("fetching user", username);

  return fetch("http://localhost:3000/api/projects")
    .then((response) => response.json())
    .then((body) =>
      body.data.map(
        (item: Project) =>
          ({ label: item.name, value: item.id } as ProJectValue)
      )
    );
}

export const SelectProject = ({
  onSelectValue,
}: {
  onSelectValue: (value: string) => void;
}) => {
  const [value, setValue] = useState<ProJectValue>();

  return (
    <DebounceSelect
      value={value}
      placeholder="Select project"
      fetchOptions={fetchProjectList}
      onChange={(newValue) => {
        setValue(newValue as ProJectValue[]);
        onSelectValue( newValue);
      }}
      style={{ width: "100%" }}
    />
  );
};
