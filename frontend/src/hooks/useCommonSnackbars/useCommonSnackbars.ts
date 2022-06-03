import { useSnackbar, OptionsObject } from 'notistack';
import { SNACKBAR_DEFAULT_OPTIONS } from '../../constants/snackbar';

export const useCommonSnackbars = () => {
  const { enqueueSnackbar } = useSnackbar();

  const showSnackbar = (message: string, options?: OptionsObject) =>
    enqueueSnackbar(message, {
      ...SNACKBAR_DEFAULT_OPTIONS,
      ...options,
    });

  const showErrorSnackbar = (
    errorMessage = 'Ups... Wystąpił błąd. Prosimy spróbować ponownie.',
    options?: OptionsObject,
  ) =>
    showSnackbar(errorMessage, {
      variant: 'error',
      ...options,
    });

  const showSuccessSnackbar = (message: string, options?: OptionsObject) =>
    showSnackbar(message, {
      variant: 'success',
      ...options,
    });

  const showInfoSnackbar = (message: string, options?: OptionsObject) =>
    showSnackbar(message, {
      variant: 'info',
      ...options,
    });

  return { showErrorSnackbar, showSuccessSnackbar, showInfoSnackbar };
};
