import {
  VehicleAddFavouriteRequestDto,
  VehicleAddFavouriteResponseDto,
  VehicleGetMyFavouritesResponseDto,
  VehicleRemoveFavouriteRequestDto,
  VehicleRemoveFavouriteResponseDto,
} from '@osk/shared';
import { UserRole } from '@osk/shared/src/types/user.types';
import { useState } from 'react';
import useSWR from 'swr';
import { useAuth } from '../../../hooks/useAuth/useAuth';
import { useCommonSnackbars } from '../../../hooks/useCommonSnackbars/useCommonSnackbars';
import { useMakeRequestWithAuth } from '../../../hooks/useMakeRequestWithAuth/useMakeRequestWithAuth';

export const useVehicleFavourites = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const isInstructor = user?.role === UserRole.Instructor;
  const { showErrorSnackbar } = useCommonSnackbars();
  const makeRequest = useMakeRequestWithAuth();

  const { data, mutate, isValidating } =
    useSWR<VehicleGetMyFavouritesResponseDto>(
      isInstructor ? '/api/vehicles/favourites/my' : null,
      {
        onError: () => {
          showErrorSnackbar(
            'Wystąpił błąd podczas wczytywania ulubionych pojazdów',
          );
        },
      },
    );

  const favouriteVehiclesIds = data?.vehicles ?? [];

  const onAddFavourite = async (vehicleId: number) => {
    const body: VehicleAddFavouriteRequestDto = { vehicleId };

    try {
      setIsLoading(true);
      await makeRequest<
        VehicleAddFavouriteResponseDto,
        VehicleAddFavouriteRequestDto
      >('/api/vehicles/favourites', 'POST', body);
      mutate();
    } catch (error) {
      showErrorSnackbar('Wystąpił błąd podczas dodawania do ulubionych');
    } finally {
      setIsLoading(false);
    }
  };

  const onRemoveFavourite = async (vehicleId: number) => {
    const body: VehicleRemoveFavouriteRequestDto = { vehicleId };

    try {
      setIsLoading(true);
      await makeRequest<
        VehicleRemoveFavouriteResponseDto,
        VehicleRemoveFavouriteRequestDto
      >('/api/vehicles/favourites', 'DELETE', body);
      mutate();
    } catch (error) {
      showErrorSnackbar('Wystąpił błąd podczas dodawania do ulubionych');
    } finally {
      setIsLoading(false);
    }
  };

  const onToggleFavourite = (vehicleId: number, isFavourite: boolean) => {
    if (isFavourite) {
      return onRemoveFavourite(vehicleId);
    }

    return onAddFavourite(vehicleId);
  };

  return {
    isLoading: isValidating || isLoading,
    favouriteVehiclesIds,
    onToggleFavourite,
  };
};
