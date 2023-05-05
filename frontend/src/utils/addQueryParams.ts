export const addQueryParams = <T extends Record<string, any>>(
  url: string,
  params: T,
) => {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    queryParams.append(key, value);
  });

  const queryParamsString = queryParams.toString();
  return `${url}?${queryParamsString}`;
};
