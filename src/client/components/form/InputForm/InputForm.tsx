import DefaultInput from "./inputs/DefaultInput";
import DateInput from "./inputs/DateInput";
import ComboboxInput from "./inputs/ComboboxInput";

interface Option {
  title: string;
  value: string;
}

interface CustomFormFieldProps {
  name: string;
  title: string;
  description?: string;
  errorMessage?: string;
  type: "text" | "number" | "combobox" | "datepicker";
  options?: readonly Option[];
}

const InputForm: React.FC<CustomFormFieldProps> = ({
  name,
  title,
  description,
  errorMessage,
  type,
  options,
}) => {
  if (type === "number" || type === "text") {
    return (
      <DefaultInput
        name={name}
        title={title}
        description={description}
        errorMessage={errorMessage}
        type={type}
      />
    );
  } else if (type === "combobox") {
    return (
      <ComboboxInput
        name={name}
        title={title}
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
  } else {
    return null;
  }
};

export default InputForm;
