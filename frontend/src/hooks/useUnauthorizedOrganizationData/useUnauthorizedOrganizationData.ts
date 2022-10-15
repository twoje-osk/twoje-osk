import { OrganizationGetPublicInfoResponseDto } from '@osk/shared';
import useSWR from 'swr';

export const useUnauthorizedOrganizationData = () => {
  const { data, error } =
    useSWR<OrganizationGetPublicInfoResponseDto>('/api/organization');
  const oskName = data?.organization.name;

  return {
    oskName,
    error,
  };
};
