export type UserRole = 'investor' | 'admin';

export type KYCStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  kycStatus: KYCStatus;
  kycDocumentType?: string;
  kycSubmittedAt?: string;
  walletBalance: number; // Available EUR
  investedBalance: number; // In active properties
  totalEarned: number; // Realized rental yields
  createdAt: string;
  phoneNumber?: string;
  country?: string;
  cryptoDepositAddress?: string;
  avatarUrl?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}
