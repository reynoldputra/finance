import DefaultInput from "./inputs/DefaultInput";
import DateInput from "./inputs/DateInput";
import ComboboxInput from "./inputs/ComboboxInput";
import { ComboboxItem } from "@client/types/form/ComboboxItem";

interface CustomFormFieldProps {
  name: string;
  title: string;
  description?: string;
  placeholder?: string;
  errorMessage?: string;
  type: "text" | "number" | "combobox" | "datepicker";
  disabled?: boolean;
  options?: readonly ComboboxItem[];
}

const InputForm: React.FC<CustomFormFieldProps> = ({
  name,
  title,
  description,
  errorMessage,
  disabled = false,
  type,
  options,
  placeholder
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
      <DateInput name={name} title={title} description={description} errorMessage={errorMessage} />
    );
  } else {
    return null;
  }
};

export default InputForm;
