import { TextField, TextFieldProps } from '@mui/material';
import { useField } from 'formik';

type FTextFieldProps = Omit<
  Omit<Omit<TextFieldProps, 'onChange'>, 'onBlur'>,
  'value'
> & {
  name: string;
};

export const FTextField = (props: FTextFieldProps) => {
  const { name, type, helperText: externalHelperText } = props;

  const [field, meta] = useField({
    name,
    type,
  });

  const hasError = Boolean(meta.error && meta.touched);
  const helperText = hasError ? meta.error : externalHelperText;

  return (
    <TextField {...props} {...field} error={hasError} helperText={helperText} />
  );
};
