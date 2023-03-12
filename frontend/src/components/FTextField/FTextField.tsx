import { TextField, TextFieldProps } from '@mui/material';
import { isValid, parse } from 'date-fns';
import { useField, useFormikContext } from 'formik';
import { formatInput, getFormatForInputType } from '../../utils/date';

export type FTextFieldProps = Omit<
  Omit<Omit<TextFieldProps, 'onChange'>, 'onBlur'>,
  'value'
> & {
  name: string;
};

const isDateType = (
  type: React.HTMLInputTypeAttribute | undefined,
): type is 'date' | 'datetime-local' | 'time' =>
  type === 'date' || type === 'datetime-local' || type === 'time';

const getValue = (
  value: any,
  type: React.HTMLInputTypeAttribute | undefined,
) => {
  if (!isDateType(type) || !isValid(value)) {
    return value;
  }

  return formatInput(value, type);
};

export const FTextField = (props: FTextFieldProps) => {
  const { name, type, helperText: externalHelperText } = props;

  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField({
    name,
    type,
  });

  const hasError = Boolean(meta.error && meta.touched);
  const helperText = hasError ? meta.error : externalHelperText;

  const onChange: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  > = (e) => {
    field.onChange(e);

    if (!isDateType(type)) {
      return;
    }

    const parsedDate = parse(
      e.target.value,
      getFormatForInputType(type),
      new Date(),
    );

    if (!isValid(parsedDate)) {
      setFieldValue(name, meta.initialValue);
      return;
    }

    setFieldValue(name, parsedDate);
  };

  return (
    <TextField
      {...props}
      {...field}
      onChange={onChange}
      value={getValue(field.value, type) ?? ''}
      error={hasError}
      helperText={helperText}
      InputLabelProps={{ shrink: isDateType(type) ? true : undefined }}
    />
  );
};
