import DefaultInput from "./inputs/DefaultInput";
import DateInput from "./inputs/DateInput";
import ComboboxInput from "./inputs/ComboboxInput";

interface Option {
  title: string;
  value: string;
}

interface CustomFormFieldProps {
  title: string;
  description?: string;
  errorMessage?: string;
  type: "text" | "number" | "combobox" | "datepicker";
  options?: readonly Option[];
}

const InputForm: React.FC<CustomFormFieldProps> = ({
  title,
  description,
  errorMessage,
  type,
  options,
}) => {
  if (type === "number" || type === "text") {
    return (
      <DefaultInput
        title={title}
        description={description}
        errorMessage={errorMessage}
        type={type}
      />
    );
  } else if (type === "combobox") {
    return (
      <ComboboxInput
        title={title}
        description={description}
        errorMessage={errorMessage}
        options={options}
      />
    );
  } else if (type === "datepicker") {
    return (
      <DateInput
        title={title}
        description={description}
        errorMessage={errorMessage}
      />
    );
  } else {
    return null;
  }
};

export default InputForm;
