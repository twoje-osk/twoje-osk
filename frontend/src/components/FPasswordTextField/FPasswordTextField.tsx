import { InputAdornment, IconButton, Icon } from '@mui/material';
import { useState } from 'react';
import { FTextField, FTextFieldProps } from '../FTextField/FTextField';

export const FPasswordTextField = ({
  InputProps,
  ...props
}: Omit<FTextFieldProps, 'type'>) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const type = isPasswordShown ? 'text' : 'password';

  return (
    <FTextField
      {...props}
      type={type}
      InputProps={{
        ...InputProps,
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setIsPasswordShown(!isPasswordShown)}
            >
              {isPasswordShown ? (
                <Icon>visibility</Icon>
              ) : (
                <Icon>visibility_off</Icon>
              )}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};
