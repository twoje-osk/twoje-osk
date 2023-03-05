import {
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  SelectProps,
} from '@mui/material';
import { useField } from 'formik';

type FSelectProps<T> = Omit<
  SelectProps<T>,
  'onChange' | 'onBlur' | 'value' | 'labelId'
> & {
  id: string;
  name: string;
  helperText?: string;
};

export function FSelect<T>(props: FSelectProps<T>) {
  const {
    name,
    type,
    helperText: externalHelperText,
    label,
    id,
    required,
  } = props;

  const [field, meta] = useField({
    name,
    type,
  });

  const hasError = Boolean(meta.error && meta.touched);
  const helperText = hasError ? meta.error : externalHelperText;
  const labelId = `${id}-label`;

  return (
    <FormControl>
      {label && (
        <InputLabel required={required} id={labelId}>
          {label}
        </InputLabel>
      )}
      <Select<T>
        {...props}
        {...field}
        value={field.value ?? ''}
        error={hasError}
        labelId={labelId}
      />
      {helperText && (
        <FormHelperText error={hasError}>{helperText}</FormHelperText>
      )}
    </FormControl>
  );
}
