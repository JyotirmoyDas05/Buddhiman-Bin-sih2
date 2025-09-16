import { router } from 'expo-router';

export const navigateToAuth = () => {
  router.replace('/login' as any);
};

export const navigateToTabs = () => {
  router.replace('/(tabs)' as any);
};

export const navigateToRegister = () => {
  router.push('/register' as any);
};

export const navigateToOTP = (phone: string) => {
  router.push({
    pathname: '/otp' as any,
    params: { phone }
  });
};
