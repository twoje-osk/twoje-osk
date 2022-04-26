import { SetMetadata } from '@nestjs/common';

export const SHOULD_SKIP_AUTH_KEY = 'isPublic';
export const SkipAuth = () => SetMetadata(SHOULD_SKIP_AUTH_KEY, true);
