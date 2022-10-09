import { GetMyLessonsResponseDTO } from '@osk/shared';
import useSWR from 'swr';

export const InstructorMyLessons = () => {
  const { data: lessonsData } = useSWR<GetMyLessonsResponseDTO>(`/api/lessons`);

  return <pre>{JSON.stringify(lessonsData, null, 2)}</pre>;
};
