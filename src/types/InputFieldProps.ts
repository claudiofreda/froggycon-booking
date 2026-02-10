import {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";

export type InputFieldProps<TFormValues extends FieldValues> = {
  id: Path<TFormValues>;
  label: string;
  type: string;
  register: UseFormRegister<TFormValues>;
  error?: FieldError;
};
