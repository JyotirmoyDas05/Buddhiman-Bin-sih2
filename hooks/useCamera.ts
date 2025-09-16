import { useCameraPermissions } from 'expo-camera';

export const useCamera = () => {
  const [permission, requestPermission] = useCameraPermissions();

  return {
    hasPermission: permission?.granted ?? false,
    requestPermission,
    isReady: permission?.granted ?? false,
  };
};
