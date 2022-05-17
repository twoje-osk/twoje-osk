import { makeRequest } from '../../utils/makeRequest';

export const getMakeRequestWithAuth =
  <ResponseDto>(accessToken: string | null) =>
  async (resource: string) => {
    const response = await makeRequest<ResponseDto>(resource, accessToken);

    if (response.ok) {
      return response.data;
    }

    throw response.error;
  };
