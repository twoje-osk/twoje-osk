import * as Yup from 'yup';
import { setupYupLocale } from '../../../utils/setupYupLocale';

export interface AnnouncementFormSchema {
  subject: string;
  body: string;
}

setupYupLocale();
export const announcementsValidationSchema: Yup.SchemaOf<AnnouncementFormSchema> =
  Yup.object().shape({
    subject: Yup.string().required().max(512),
    body: Yup.string().required().max(1000),
  });
