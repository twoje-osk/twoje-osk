import {
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  SelectProps,
} from '@mui/material';
import { useField } from 'formik';

type FSelectProps = Omit<
  SelectProps,
  'onChange' | 'onBlur' | 'value' | 'labelId'
> & {
  id: string;
  name: string;
  helperText?: string;
};

export const FSelect = (props: FSelectProps) => {
  const { name, type, helperText: externalHelperText, label, id } = props;

  const [field, meta] = useField({
    name,
    type,
  });

  const hasError = Boolean(meta.error && meta.touched);
  const helperText = hasError ? meta.error : externalHelperText;
  const labelId = `${id}-label`;

  return (
    <FormControl>
      {label && <InputLabel id={labelId}>{label}</InputLabel>}
      <Select {...props} {...field} error={hasError} labelId={labelId} />
      {helperText && (
        <FormHelperText error={hasError}>{helperText}</FormHelperText>
      )}
    </FormControl>
  );
};
