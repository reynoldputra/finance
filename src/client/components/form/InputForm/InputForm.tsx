import DefaultInput from "./inputs/DefaultInput";
import DateInput from "./inputs/DateInput";
import ComboboxInput from "./inputs/ComboboxInput";
import { ComboboxItem } from "@client/types/form/ComboboxItem";
import MultiSelectInput from "./inputs/MultiSelectInput";

interface CustomFormFieldProps {
  name: string;
  title: string;
  description?: string;
  placeholder?: string;
  errorMessage?: string;
  type: "text" | "number" | "combobox" | "datepicker" | "multiselect";
  disabled?: boolean;
  options?: readonly ComboboxItem[];
  multiOption?: {
    label: string;
    value: string;
  }[];
  defaultValue?: string[];
}

const InputForm: React.FC<CustomFormFieldProps> = ({
  name,
  title,
  description,
  errorMessage,
  disabled = false,
  type,
  options,
  placeholder,
  multiOption,
  defaultValue,
}) => {
  if (type === "number" || type === "text") {
    return (
      <DefaultInput
        placeholder={placeholder}
        name={name}
        title={title}
        description={description}
        errorMessage={errorMessage}
        disabled={disabled}
        type={type}
      />
    );
  } else if (type === "combobox") {
    return (
      <ComboboxInput
        name={name}
        title={title}
        disabled={disabled}
        description={description}
        errorMessage={errorMessage}
        options={options}
      />
    );
  } else if (type === "datepicker") {
    return (
      <DateInput
        name={name}
        title={title}
        description={description}
        errorMessage={errorMessage}
      />
    );
  } else if (type === "multiselect") {
    return (
      <MultiSelectInput
        name={name}
        title={title}
        description={description}
        errorMessage={errorMessage}
        disabled={disabled}
        options={multiOption ?? []}
        defaultValue={defaultValue ?? []}
      />
    );
  } else {
    return null;
  }
};

export default InputForm;
