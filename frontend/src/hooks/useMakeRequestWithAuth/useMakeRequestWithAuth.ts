import { useCallback } from 'react';
import { makeRequest } from '../../utils/makeRequest';
import { useAuth } from '../useAuth/useAuth';

export const useMakeRequestWithAuth = () => {
  const { accessToken, logOut } = useAuth();

  return useCallback(
    async <ResponseDto, RequestDto = never>(
      url: string,
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
      requestBody?: RequestDto,
    ) => {
      const response = await makeRequest<ResponseDto, RequestDto>(
        url,
        accessToken,
        method,
        requestBody,
      );

      if (!response.ok && response.error.status === 401) {
        logOut();
      }

      return response;
    },
    [accessToken, logOut],
  );
};
