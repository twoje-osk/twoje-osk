import queryString from 'qs';

export const addQueryParams = <T extends Record<string, any>>(
  url: string,
  params: T,
) => {
  const queryParamsString = queryString.stringify(params, {
    encodeValuesOnly: true,
  });

  return `${url}?${queryParamsString}`;
};
