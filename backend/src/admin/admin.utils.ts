/* eslint-disable no-await-in-loop */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-plusplus */

import {
  ActionResponse,
  After,
  BaseResource,
  ParamsType,
  RecordJSON,
  ResourceWithOptions,
} from 'adminjs';

export interface SortedResourceWithOptions extends ResourceWithOptions {
  order?: number;
}

export function withCustomResourceOptions(
  resources: unknown[],
  options: SortedResourceWithOptions[],
) {
  const overwrittenEntities = options.map(({ resource }) => resource);

  const filteredResources = resources
    .filter((entity) => !overwrittenEntities.includes(entity))
    .map(
      (resource): SortedResourceWithOptions => ({
        resource,
        options: {},
      }),
    );

  return [...filteredResources, ...options]
    .map((resource) => {
      const navigationName =
        typeof resource.options.navigation !== 'boolean' &&
        typeof resource.options.navigation !== 'string'
          ? resource.options.navigation?.name
          : undefined;

      return {
        ...resource,
        options: {
          ...(resource.options ?? {}),
          navigation:
            navigationName === undefined ? null : resource.options.navigation,
        },
      };
    })
    .sort((a, b) => {
      const aOrder = a.order ?? Infinity;
      const bOrder = b.order ?? Infinity;

      return aOrder - bOrder;
    });
}

const setUserSubtypeOrganization = (
  record: RecordJSON,
  orgParams: ParamsType | undefined,
): RecordJSON => {
  const result: RecordJSON = {
    ...record,
    params: {
      ...record.params,
      organization: record.populated.userId?.params.organizationId,
    },
    populated: {
      ...record.populated,
      organization: orgParams
        ? {
            populated: {},
            baseError: null,
            bulkActions: [],
            errors: {},
            id: record.populated.userId?.params.organizationId,
            params: orgParams,
            recordActions: record.recordActions.filter(
              (ra) => ra.name === 'show',
            ),
            title: orgParams.name,
          }
        : undefined,
    },
  };

  return result;
};

const getOrganizationFromRecord = async (
  record: RecordJSON,
  OrganizationResource: BaseResource,
) => {
  const organizationId = record.populated.userId?.params.organizationId;
  if (organizationId === undefined) {
    return undefined;
  }

  const organization = await OrganizationResource.findOne(organizationId);

  return organization?.params;
};

export const setUserSubtypeOrganizationForList: After<ActionResponse> = async (
  response,
  request,
  context,
) => {
  const records: RecordJSON[] = response.records || [];
  const OrganizationResource = context._admin.findResource('Organization');

  for (let i = 0; i < records.length; i++) {
    const record: RecordJSON = response.records[i];
    response.records[i] = setUserSubtypeOrganization(
      record,
      await getOrganizationFromRecord(record, OrganizationResource),
    );
  }

  return response;
};
export const setUserSubtypeOrganizationForSingleElement: After<
  ActionResponse
> = async (response, request, context) => {
  const OrganizationResource = context._admin.findResource('Organization');
  const record: RecordJSON = response.record ?? {};

  response.record = setUserSubtypeOrganization(
    record,
    await getOrganizationFromRecord(record, OrganizationResource),
  );

  return response;
};
