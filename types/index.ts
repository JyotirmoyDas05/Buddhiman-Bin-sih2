export interface User {
  id: string;
  name?: string;
  phone: string;
  address?: string;
  email?: string;
  householdMembers?: number;
  isVerified: boolean;
  joinDate: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (phone: string, otp: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  sendOTP: (phone: string) => Promise<boolean>;
}

export interface RegisterData {
  name: string;
  phone: string;
  email?: string;
  address: string;
  householdMembers: number;
}


export interface WasteEntry {
  id: string;
  userId: string;
  type: 'biodegradable' | 'recyclable' | 'hazardous' | 'general';
  weight: number;
  photo: string;
  location: {
    latitude: number;
    longitude: number;
  };
  timestamp: string;
  points: number;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  points: number;
  category: 'tax_rebate' | 'discount' | 'voucher';
  validity: string;
  available: boolean;
}

export interface SmartBin {
  id: string;
  location: {
    latitude: number;
    longitude: number;
  };
  address: string;
  fillLevel: number;
  type: string[];
  lastUpdated: string;
}

export interface Analytics {
  weeklyTotal: number;
  monthlyTotal: number;
  carbonFootprintSaved: number;
  segregationAccuracy: number;
  treesEquivalent: number;
  co2Reduced: number;
}

export type RootTabParamList = {
  Home: undefined;
  Track: undefined;
  Rewards: undefined;
  Profile: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  OTPVerification: { phone: string };
};