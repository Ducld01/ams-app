import { reference_action_options } from "./constant";

export const useRenderReferenceActionOptions = () => {
  const option = reference_action_options;

  const renderOption = (refType: string) => {
    switch (refType) {
      case "country":
      case "IP":
      case "vpn":
        return option.filter((item) =>
          ["is", "is_not", "have", "not_have"].includes(item.value)
        );
      case "cost":
        return option.filter((item) =>
          [
            "is",
            "not_have",
            "not_middle",
            "middle",
            "bigger",
            "smaller",
          ].includes(item.value)
        );
      case "click":
        return option.filter((item) =>
          [
            "is",
            "is_not",
            "not_middle",
            "middle",
            "bigger",
            "smaller",
          ].includes(item.value)
        );
      case "time":
        return option.filter((item) =>
          ["not_middle", "middle", "bigger", "smaller"].includes(item.value)
        );
      case "device":
        return option.filter((item) => ["is", "is_not"].includes(item.value));
      case "referer":
        return [];
      default:
        return option;
    }
  };

  return { renderOption };
};
