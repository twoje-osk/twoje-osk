import { FindManyOptions } from 'typeorm';

export const DEFAULT_PAGE = 0;
export const DEFAULT_PAGE_SIZE = 100;

export interface PresentationPaginationArguments {
  page?: number;
  pageSize?: number;
}

export const getLimitArguments = (
  paginationArgs: PresentationPaginationArguments | undefined,
) => {
  const pageSize = paginationArgs?.pageSize ?? DEFAULT_PAGE_SIZE;
  const page = paginationArgs?.page ?? DEFAULT_PAGE;
  const skip = page * pageSize;

  const limitArguments: Pick<FindManyOptions<any>, 'take' | 'skip'> = {
    take: pageSize,
    skip,
  };

  return limitArguments;
};

export interface PresentationSortArguments<T extends string> {
  sortBy?: T;
  sortOrder?: 'asc' | 'desc';
}
