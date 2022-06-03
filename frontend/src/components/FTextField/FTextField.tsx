import { TextField, TextFieldProps } from '@mui/material';
import { format, isValid } from 'date-fns';
import { useField } from 'formik';
import { INPUT_DATE } from '../../constants/dateFormats';

type FTextFieldProps = Omit<
  Omit<Omit<TextFieldProps, 'onChange'>, 'onBlur'>,
  'value'
> & {
  name: string;
};

const isDateType = (type: React.HTMLInputTypeAttribute | undefined) =>
  type === 'date' || type === 'datetime-local' || type === 'time';

const getValue = (
  value: any,
  type: React.HTMLInputTypeAttribute | undefined,
) => {
  if (!isDateType(type) || !isValid(value)) {
    return value;
  }

  return format(value, INPUT_DATE);
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
    <TextField
      {...props}
      {...field}
      value={getValue(field.value, type)}
      error={hasError}
      helperText={helperText}
      InputLabelProps={{ shrink: isDateType(type) ? true : undefined }}
    />
  );
};
