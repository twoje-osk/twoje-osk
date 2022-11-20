const RESPONSE_DECORATOR_NAMES = [
  'ApiResponse',
  'ApiOkResponse',
  'ApiCreatedResponse',
  'ApiAcceptedResponse',
  'ApiNoContentResponse',
  'ApiMovedPermanentlyResponse',
  'ApiFoundResponse',
  'ApiBadRequestResponse',
  'ApiUnauthorizedResponse',
  'ApiNotFoundResponse',
  'ApiForbiddenResponse',
  'ApiMethodNotAllowedResponse',
  'ApiNotAcceptableResponse',
  'ApiRequestTimeoutResponse',
  'ApiConflictResponse',
  'ApiPreconditionFailedResponse',
  'ApiTooManyRequestsResponse',
  'ApiGoneResponse',
  'ApiPayloadTooLargeResponse',
  'ApiUnsupportedMediaTypeResponse',
  'ApiUnprocessableEntityResponse',
  'ApiInternalServerErrorResponse',
  'ApiNotImplementedResponse',
  'ApiBadGatewayResponse',
  'ApiServiceUnavailableResponse',
  'ApiGatewayTimeoutResponse',
  'ApiDefaultResponse',
];
const REQUEST_INDICATOR_DECORATOR_NAMES = [
  'Post',
  'Get',
  'Delete',
  'Put',
  'Patch',
  'Options',
  'Head',
  'All',
];

const DEFAULT_DECORATOR = 'ApiResponse';

module.exports = {
  RESPONSE_DECORATOR_NAMES,
  DEFAULT_DECORATOR,
  REQUEST_INDICATOR_DECORATOR_NAMES,
};
