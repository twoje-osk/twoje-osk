import { SelectChangeEvent } from '@mui/material';
import useSWR from 'swr';
import {
  LessonsDTO,
  UpdateLessonRequestDTO,
  UpdateLessonResponseDTO,
  VehicleFindAllResponseDto,
  VehicleGetMyFavouritesResponseDto,
} from '@osk/shared';
import { useEffect, useMemo, useState } from 'react';
import { LessonStatus } from '@osk/shared/src/types/lesson.types';
import { useMakeRequestWithAuth } from '../../../../hooks/useMakeRequestWithAuth/useMakeRequestWithAuth';
import { useCommonSnackbars } from '../../../../hooks/useCommonSnackbars/useCommonSnackbars';

export const useSelectedVehicle = (vehicleIdFromLesson: number | null) => {
  const favouritesIds = useFavouriteVehicles();
  const { data: vehiclesData, error: vehiclesError } =
    useSWR<VehicleFindAllResponseDto>('/api/vehicles');
  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null);
  const [hasSelectedVehicleSubmitError, setHasSelectedVehicleSubmitError] =
    useState(false);
  const vehicles = useMemo(
    () => vehiclesData?.vehicles ?? [],
    [vehiclesData?.vehicles],
  );

  useEffect(() => {
    setSelectedVehicle(vehicleIdFromLesson);
    setHasSelectedVehicleSubmitError(false);
  }, [vehicleIdFromLesson]);

  const onVehicleChange = (event: SelectChangeEvent<number | string>) => {
    const { value } = event.target;
    setHasSelectedVehicleSubmitError(false);

    if (typeof value === 'string') {
      setSelectedVehicle(null);
      return;
    }

    setSelectedVehicle(value);
  };

  const loadingState = useMemo((): 'error' | 'loading' | 'done' => {
    if (vehiclesError) {
      return 'error';
    }

    return vehiclesData === undefined ? 'loading' : 'done';
  }, [vehiclesData, vehiclesError]);

  const sortedVehicles = useMemo(() => {
    return vehicles
      .map((v) => ({
        ...v,
        isFavourite: favouritesIds.includes(v.id),
      }))
      .sort((a, b) => {
        const isAFavourite = a.isFavourite;
        const isBFavourite = b.isFavourite;

        if (!isAFavourite && !isBFavourite) {
          return 0;
        }

        if (isAFavourite && isBFavourite) {
          return 0;
        }

        if (isAFavourite) {
          return -1;
        }

        if (isBFavourite) {
          return 1;
        }

        return 0;
      });
  }, [favouritesIds, vehicles]);

  return {
    vehicles: sortedVehicles,
    loadingState,
    selectedVehicle,
    hasSelectedVehicleSubmitError,
    setHasSelectedVehicleSubmitError,
    onVehicleChange,
  };
};

export const useFinishLessonApiRequest = ({
  selectedVehicle,
  lesson,
  setHasSelectedVehicleSubmitError,
  mutateLesson,
}: {
  selectedVehicle: number | null;
  lesson: LessonsDTO | undefined;
  setHasSelectedVehicleSubmitError: (hasError: boolean) => void;
  mutateLesson: () => Promise<unknown>;
}) => {
  const makeRequestWithAuth = useMakeRequestWithAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showErrorSnackbar } = useCommonSnackbars();

  const onSave = async () => {
    if (selectedVehicle === null) {
      setHasSelectedVehicleSubmitError(true);
      return;
    }

    if (lesson === undefined || selectedVehicle === null) {
      return;
    }

    setIsSubmitting(true);
    const body: UpdateLessonRequestDTO = {
      ...lesson,
      status: LessonStatus.Finished,
      vehicleId: selectedVehicle,
    };

    const result = await makeRequestWithAuth<
      UpdateLessonResponseDTO,
      UpdateLessonRequestDTO
    >(`/api/instructor/lessons/${lesson.id}`, 'PUT', body);

    if (!result.ok) {
      setIsSubmitting(false);
      showErrorSnackbar();
      return;
    }

    await mutateLesson();
    setIsSubmitting(false);
  };

  const onRevertSave = async () => {
    if (lesson === undefined) {
      return;
    }

    setIsSubmitting(true);
    const body: UpdateLessonRequestDTO = {
      ...lesson,
      vehicleId: null,
      status: LessonStatus.Accepted,
    };

    const result = await makeRequestWithAuth<
      UpdateLessonResponseDTO,
      UpdateLessonRequestDTO
    >(`/api/instructor/lessons/${lesson.id}`, 'PUT', body);

    if (!result.ok) {
      setIsSubmitting(false);
      showErrorSnackbar();
      return;
    }

    await mutateLesson();
    setIsSubmitting(false);
  };

  return {
    isSubmitting,
    onSave,
    onRevertSave,
  };
};

export const useFavouriteVehicles = () => {
  const { showErrorSnackbar } = useCommonSnackbars();
  const { data } = useSWR<VehicleGetMyFavouritesResponseDto>(
    '/api/vehicles/favourites/my',
    {
      onError: () => {
        showErrorSnackbar(
          'Wystąpił błąd podczas wczytywania ulubionych pojazdów',
        );
      },
    },
  );

  const favouriteVehiclesIds = data?.vehicles ?? [];

  return favouriteVehiclesIds;
};
