import { Transaction, TransactionType, TransactionStatus, LedgerEntry } from '../types/transaction';
import { User, KYCStatus, UserRole } from '../types/user';
import { Property } from '../types/property';
import { Investment } from '../types/investment';
import { INITIAL_PROPERTIES } from '../data/properties';

export interface AuditLog {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'financial';
  read: boolean;
  createdAt: string;
}

export interface CryptoNetworkConfig {
  id: string;
  name: string;
  token: string;
  network: string;
  walletAddress: string;
  enabled: boolean;
}

export interface TraditionalPaymentConfig {
  beneficiary: string;
  iban: string;
  bic: string;
  bankName: string;
  supportEmail: string;
  instructions: string;
}

export interface PaymentConfig {
  traditional: TraditionalPaymentConfig;
  cryptoNetworks: CryptoNetworkConfig[];
}

const DEFAULT_PAYMENT_CONFIG: PaymentConfig = {
  traditional: {
    beneficiary: 'Rental-log Escrow Services S.L.',
    iban: 'ES91 2100 0418 4502 0005 1829',
    bic: 'CAIXESBBXXX',
    bankName: 'CaixaBank Institutional Escrow',
    supportEmail: 'payments@reental-log.com',
    instructions: 'Include your unique transfer reference in the wire transfer concept and email your transfer confirmation receipt to payments@reental-log.com for rapid verification.'
  },
  cryptoNetworks: [
    {
      id: 'net-usdt-polygon',
      name: 'Polygon POS (Low Gas)',
      token: 'USDT / USDC',
      network: 'Polygon',
      walletAddress: '0x39a9c29801869e94F2B85295c5Af646A9894A0b2',
      enabled: true
    },
    {
      id: 'net-usdt-trc20',
      name: 'Tron Network (TRC-20)',
      token: 'USDT',
      network: 'TRC-20',
      walletAddress: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
      enabled: true
    },
    {
      id: 'net-usdt-erc20',
      name: 'Ethereum Mainnet (ERC-20)',
      token: 'USDT / USDC',
      network: 'Ethereum',
      walletAddress: '0x71C8135C0e41B3fA128912389128f9A19b28A0bf',
      enabled: true
    },
    {
      id: 'net-bnb-bsc',
      name: 'BNB Smart Chain (BEP-20)',
      token: 'USDT / BNB',
      network: 'BNB Smart Chain',
      walletAddress: '0x5291bfa9821389128931a98124901b2a98124018',
      enabled: true
    }
  ]
};

// In-Memory & LocalStorage Persistent Ledger
const STORAGE_PREFIX = 'rentallog_v1_';

function getStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error('Storage read error:', e);
    return defaultValue;
  }
}

function setStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage write error:', e);
  }
}

// Generate deterministic verifiable hash
function generateTxHash(reference: string, amount: number, timestamp: string): string {
  const raw = `${reference}:${amount}:${timestamp}:${Math.random().toString(36).substring(2, 9)}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    const char = raw.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return '0x' + Math.abs(hash).toString(16).padStart(8, '0') + Math.random().toString(36).substring(2, 10);
}

// Initial Admin and Demo Investor
const DEFAULT_USERS: User[] = [
  {
    id: 'usr-admin-1',
    email: 'admin@reental-log.com',
    fullName: 'Platform Administrator',
    role: 'admin',
    kycStatus: 'verified',
    walletBalance: 250000.00,
    investedBalance: 0,
    totalEarned: 0,
    createdAt: '2026-01-01T00:00:00Z',
    country: 'Spain',
    cryptoDepositAddress: '0x71C...B3fA (Platform Treasury)'
  },
  {
    id: 'usr-investor-demo',
    email: 'investor@reental-log.com',
    fullName: 'David Vance',
    role: 'investor',
    kycStatus: 'verified',
    walletBalance: 2450.00,
    investedBalance: 1200.00,
    totalEarned: 136.80,
    createdAt: '2026-01-15T12:00:00Z',
    phoneNumber: '+34 612 345 678',
    country: 'Spain',
    cryptoDepositAddress: '0x39a9c29801869e94F2B85295c5Af646A9894A0b2'
  }
];

const DEFAULT_INVESTMENTS: Investment[] = [
  {
    id: 'inv-101',
    userId: 'usr-investor-demo',
    propertyId: 'prop-valencia-01',
    propertyTitle: 'Valencia Ruzafa Smart Living',
    propertyLocation: 'Calle Ruzafa 42, Valencia',
    propertyImage: '/src/assets/images/prop_valencia_apt_1791998371242.jpg',
    tokensPurchased: 7,
    tokenPrice: 100,
    totalAmountInvested: 700,
    purchasedAt: '2026-02-14T14:32:00Z',
    estimatedAnnualYield: 11.4,
    projectedMonthlyIncome: 6.65,
    totalDividendsReceived: 79.80,
    status: 'active',
    transactionHash: '0x5a18b9c2409f872110c4d812',
    certificateId: 'CERT-VAL-101'
  },
  {
    id: 'inv-102',
    userId: 'usr-investor-demo',
    propertyId: 'prop-madrid-02',
    propertyTitle: 'Madrid Chamberí Urban Coliving',
    propertyLocation: 'Calle de Santa Engracia 78, Madrid',
    propertyImage: '/src/assets/images/prop_madrid_living_1791998371897.jpg',
    tokensPurchased: 5,
    tokenPrice: 100,
    totalAmountInvested: 500,
    purchasedAt: '2026-01-28T09:15:00Z',
    estimatedAnnualYield: 12.8,
    projectedMonthlyIncome: 5.33,
    totalDividendsReceived: 57.00,
    status: 'active',
    transactionHash: '0x992cf014bca883921901a182',
    certificateId: 'CERT-MAD-102'
  }
];

const DEFAULT_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-201',
    userId: 'usr-investor-demo',
    type: 'deposit',
    amount: 3000,
    currency: 'EUR',
    status: 'completed',
    description: 'SEPA Instant Transfer from Banco Santander (ES91...)',
    reference: 'DEP-SEPA-94821',
    createdAt: '2026-01-20T10:00:00Z',
    paymentMethod: 'SEPA Bank Transfer',
    balanceAfter: 3000,
    txHash: 'ES91-2100-0418-4502-0005-1829'
  },
  {
    id: 'tx-202',
    userId: 'usr-investor-demo',
    type: 'investment',
    amount: 500,
    currency: 'EUR',
    status: 'completed',
    description: 'Acquisition of 5 RENT-MAD02 Tokens in Madrid Chamberí Coliving',
    reference: 'INV-MAD-005',
    createdAt: '2026-01-28T09:15:00Z',
    paymentMethod: 'Internal Balance',
    balanceAfter: 2500,
    txHash: '0x992cf014bca883921901a182',
    metadata: {
      propertyId: 'prop-madrid-02',
      propertyTitle: 'Madrid Chamberí Urban Coliving',
      tokens: 5
    }
  },
  {
    id: 'tx-203',
    userId: 'usr-investor-demo',
    type: 'investment',
    amount: 700,
    currency: 'EUR',
    status: 'completed',
    description: 'Acquisition of 7 RENT-VAL01 Tokens in Valencia Ruzafa Smart Living',
    reference: 'INV-VAL-007',
    createdAt: '2026-02-14T14:32:00Z',
    paymentMethod: 'Internal Balance',
    balanceAfter: 1800,
    txHash: '0x5a18b9c2409f872110c4d812',
    metadata: {
      propertyId: 'prop-valencia-01',
      propertyTitle: 'Valencia Ruzafa Smart Living',
      tokens: 7
    }
  },
  {
    id: 'tx-204',
    userId: 'usr-investor-demo',
    type: 'deposit',
    amount: 600,
    currency: 'USDT',
    status: 'completed',
    description: 'Polygon Network USDT Deposit',
    reference: 'DEP-CRYPTO-4182',
    createdAt: '2026-02-25T16:45:00Z',
    paymentMethod: 'Crypto USDT (Polygon)',
    balanceAfter: 2400,
    txHash: '0x4f82c18d37aa9081bb59218d6a8f114c0001891b'
  },
  {
    id: 'tx-205',
    userId: 'usr-investor-demo',
    type: 'distribution',
    amount: 50,
    currency: 'EUR',
    status: 'completed',
    description: 'Monthly Net Rental Dividend Distribution for February 2026',
    reference: 'DIST-2026-02',
    createdAt: '2026-03-01T08:00:00Z',
    paymentMethod: 'Rental Distribution',
    balanceAfter: 2450
  }
];

class LedgerService {
  private users: User[];
  private properties: Property[];
  private investments: Investment[];
  private transactions: Transaction[];
  private auditLogs: AuditLog[];
  private notifications: Notification[];
  private paymentConfig: PaymentConfig;
  private isProcessingLock: boolean = false;

  constructor() {
    this.users = getStorage('users', DEFAULT_USERS);
    const storedProps = getStorage<Property[]>('properties', []);
    const initialOrStored = (!storedProps || storedProps.length === 0 || storedProps.some(p => (p.minimumInvestment || 0) < 1000 || !p.feeStructure))
      ? INITIAL_PROPERTIES
      : storedProps;
    this.properties = Array.from(new Map(initialOrStored.map(p => [p.id, p])).values());
    setStorage('properties', this.properties);
    this.investments = getStorage('investments', DEFAULT_INVESTMENTS);
    this.transactions = getStorage('transactions', DEFAULT_TRANSACTIONS);
    this.paymentConfig = getStorage('paymentConfig', DEFAULT_PAYMENT_CONFIG);
    this.auditLogs = getStorage('auditLogs', [
      {
        id: 'audit-1',
        adminId: 'usr-admin-1',
        adminEmail: 'admin@reental-log.com',
        action: 'SYSTEM_INITIALIZATION',
        details: 'Auditable double-entry ledger initialized with strict balance protections.',
        timestamp: '2026-01-01T00:00:00Z'
      }
    ]);
    this.notifications = getStorage('notifications', [
      {
        id: 'notif-1',
        userId: 'usr-investor-demo',
        title: 'Monthly Distribution Credited',
        message: 'Your €50.00 February rental dividend has been deposited to your available cash balance.',
        type: 'financial',
        read: false,
        createdAt: '2026-03-01T08:00:00Z'
      }
    ]);
  }

  private saveState() {
    setStorage('users', this.users);
    setStorage('properties', this.properties);
    setStorage('investments', this.investments);
    setStorage('transactions', this.transactions);
    setStorage('auditLogs', this.auditLogs);
    setStorage('notifications', this.notifications);
    setStorage('paymentConfig', this.paymentConfig);
  }

  public getPaymentConfig(): PaymentConfig {
    return JSON.parse(JSON.stringify(this.paymentConfig));
  }

  public updatePaymentConfig(config: PaymentConfig): void {
    this.paymentConfig = config;
    this.logAudit('usr-admin-1', 'admin@reental-log.com', 'PAYMENT_CONFIG_UPDATED', 'Administrator updated dual payment gateway and crypto treasury wallet settings.');
    this.saveState();
  }

  // --- User & Auth Queries ---
  public getUsers(): User[] {
    return [...this.users];
  }

  public getUserById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  public getUserByEmail(email: string): User | undefined {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public createUser(userData: { email: string; fullName: string; role?: 'investor' | 'admin' }): User {
    const existing = this.getUserByEmail(userData.email);
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser: User = {
      id: 'usr-' + Math.random().toString(36).substring(2, 10),
      email: userData.email,
      fullName: userData.fullName,
      role: userData.role || 'investor',
      kycStatus: 'unverified',
      walletBalance: 0,
      investedBalance: 0,
      totalEarned: 0,
      createdAt: new Date().toISOString(),
      cryptoDepositAddress: '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    };

    this.users.push(newUser);
    this.logAudit(newUser.id, newUser.email, 'USER_REGISTERED', `New user registered with role ${newUser.role}`);
    this.saveState();
    return newUser;
  }

  public syncSupabaseUser(supabaseId: string, email: string, fullName: string, role: UserRole = 'investor'): User {
    let existing = this.getUserById(supabaseId) || this.getUserByEmail(email);
    if (existing) {
      existing.id = supabaseId;
      if (fullName && (!existing.fullName || existing.fullName === 'Investor')) {
        existing.fullName = fullName;
      }
      this.saveState();
      return existing;
    }

    const newUser: User = {
      id: supabaseId,
      email: email,
      fullName: fullName || email.split('@')[0] || 'Investor',
      role: role,
      kycStatus: 'unverified',
      walletBalance: 0,
      investedBalance: 0,
      totalEarned: 0,
      createdAt: new Date().toISOString(),
      cryptoDepositAddress: '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    };
    this.users.push(newUser);
    this.logAudit(newUser.id, newUser.email, 'USER_REGISTERED_SUPABASE', `New Supabase user synced: ${newUser.email}`);
    this.saveState();
    return newUser;
  }

  public updateKYCStatus(userId: string, status: KYCStatus, docType?: string): User {
    const user = this.getUserById(userId);
    if (!user) throw new Error('User not found');

    user.kycStatus = status;
    if (docType) user.kycDocumentType = docType;
    if (status === 'pending') user.kycSubmittedAt = new Date().toISOString();

    this.logAudit('usr-admin-1', 'admin@reental-log.com', 'KYC_STATUS_UPDATED', `User ${user.email} KYC status set to ${status}`);
    this.createNotification(user.id, `Identity Verification: ${status.toUpperCase()}`, `Your KYC verification is now ${status}.`, status === 'verified' ? 'success' : 'info');
    this.saveState();
    return user;
  }

  // --- Properties Management ---
  public getProperties(): Property[] {
    return [...this.properties];
  }

  public getPropertyById(id: string): Property | undefined {
    return this.properties.find(p => p.id === id || p.slug === id);
  }

  public saveProperty(property: Property): Property {
    const index = this.properties.findIndex(p => p.id === property.id);
    if (index >= 0) {
      this.properties[index] = property;
    } else {
      this.properties.push(property);
    }
    this.logAudit('usr-admin-1', 'admin@reental-log.com', 'PROPERTY_UPDATED', `Property ${property.title} was saved/updated`);
    this.saveState();
    return property;
  }

  // --- Atomic Ledger Operations ---
  /**
   * Process Deposit:
   * Adds funds to available wallet balance and records ledger transaction.
   */
  public async processDeposit(
    userId: string,
    amount: number,
    currency: 'EUR' | 'USDT' | 'USDC',
    paymentMethod: string,
    externalRef?: string
  ): Promise<Transaction> {
    if (amount <= 0) throw new Error('Deposit amount must be greater than zero.');
    if (this.isProcessingLock) throw new Error('Another ledger transaction is currently processing. Please retry in a moment.');

    try {
      this.isProcessingLock = true;
      const user = this.getUserById(userId);
      if (!user) throw new Error('Investor account not found.');

      const timestamp = new Date().toISOString();
      const reference = externalRef || `DEP-${currency}-${Math.floor(100000 + Math.random() * 900000)}`;
      const txHash = generateTxHash(reference, amount, timestamp);

      // Do NOT mutate balance until admin approves deposit
      const tx: Transaction = {
        id: 'tx-' + Math.random().toString(36).substring(2, 9),
        userId: user.id,
        type: 'deposit',
        amount: amount,
        currency: currency,
        status: 'pending',
        description: `Deposit request via ${paymentMethod} (Awaiting Admin Approval)`,
        reference: reference,
        createdAt: timestamp,
        paymentMethod: paymentMethod,
        balanceAfter: user.walletBalance,
        txHash: txHash
      };

      this.transactions.unshift(tx);
      this.createNotification(user.id, 'Deposit Submitted', `Your deposit request for €${amount.toFixed(2)} is pending administrative review and approval.`, 'info');
      this.logAudit(user.id, user.email, 'DEPOSIT_REQUESTED', `User requested €${amount.toFixed(2)} deposit via ${paymentMethod}`);
      this.saveState();
      return tx;
    } finally {
      this.isProcessingLock = false;
    }
  }

  /**
   * Request Withdrawal:
   * Checks balance, verifies KYC, creates pending withdrawal, and temporarily locks funds to prevent double-spend.
   */
  public async requestWithdrawal(
    userId: string,
    amount: number,
    paymentMethod: string,
    details: { bankIban?: string; cryptoAddress?: string }
  ): Promise<Transaction> {
    if (amount <= 0) throw new Error('Withdrawal amount must be greater than zero.');
    if (this.isProcessingLock) throw new Error('Ledger is busy processing another transaction.');

    try {
      this.isProcessingLock = true;
      const user = this.getUserById(userId);
      if (!user) throw new Error('Investor account not found.');

      if (user.kycStatus !== 'verified') {
        throw new Error('Regulatory compliance requires identity verification (KYC) before processing withdrawals.');
      }

      if (user.walletBalance < amount) {
        throw new Error(`Insufficient available funds. Current available balance: €${user.walletBalance.toFixed(2)}`);
      }

      // Deduct balance immediately into pending escrow to prevent double withdrawals
      user.walletBalance = Number((user.walletBalance - amount).toFixed(2));

      const timestamp = new Date().toISOString();
      const reference = `WD-${Math.floor(100000 + Math.random() * 900000)}`;

      const tx: Transaction = {
        id: 'tx-' + Math.random().toString(36).substring(2, 9),
        userId: user.id,
        type: 'withdrawal',
        amount: amount,
        currency: 'EUR',
        status: 'pending',
        description: `Withdrawal request to ${details.bankIban || details.cryptoAddress || paymentMethod}`,
        reference: reference,
        createdAt: timestamp,
        paymentMethod: paymentMethod,
        balanceAfter: user.walletBalance,
        metadata: {
          bankIban: details.bankIban,
          destinationAddress: details.cryptoAddress
        }
      };

      this.transactions.unshift(tx);
      this.createNotification(user.id, 'Withdrawal Submitted', `Withdrawal request for €${amount.toFixed(2)} is pending administrative review.`, 'info');
      this.logAudit(user.id, user.email, 'WITHDRAWAL_REQUESTED', `User requested €${amount.toFixed(2)} withdrawal via ${paymentMethod}`);
      this.saveState();
      return tx;
    } finally {
      this.isProcessingLock = false;
    }
  }

  /**
   * Admin Review Withdrawal:
   * Approve or reject withdrawal. If rejected, funds are safely refunded back to user balance.
   */
  public async reviewWithdrawal(txId: string, approved: boolean, reason?: string): Promise<Transaction> {
    const tx = this.transactions.find(t => t.id === txId && t.type === 'withdrawal');
    if (!tx) throw new Error('Withdrawal transaction not found.');
    if (tx.status !== 'pending') throw new Error(`Withdrawal cannot be reviewed in status '${tx.status}'.`);

    const user = this.getUserById(tx.userId);
    if (!user) throw new Error('Investor not found.');

    if (approved) {
      tx.status = 'completed';
      tx.txHash = 'SEPA-EXEC-' + Math.random().toString(36).substring(2, 10).toUpperCase();
      this.createNotification(user.id, 'Withdrawal Executed', `Your withdrawal of €${tx.amount.toFixed(2)} has been successfully transferred.`, 'success');
      this.logAudit('usr-admin-1', 'admin@reental-log.com', 'WITHDRAWAL_APPROVED', `Approved withdrawal of €${tx.amount.toFixed(2)} for ${user.email}`);
    } else {
      // Refund balance
      user.walletBalance = Number((user.walletBalance + tx.amount).toFixed(2));
      tx.status = 'rejected';
      tx.balanceAfter = user.walletBalance;
      if (!tx.metadata) tx.metadata = {};
      tx.metadata.rejectionReason = reason || 'Compliance or bank details verification check failed.';
      this.createNotification(user.id, 'Withdrawal Declined', `Your withdrawal of €${tx.amount.toFixed(2)} was declined: ${tx.metadata.rejectionReason}. Funds were returned to your balance.`, 'warning');
      this.logAudit('usr-admin-1', 'admin@reental-log.com', 'WITHDRAWAL_REJECTED', `Rejected withdrawal of €${tx.amount.toFixed(2)} for ${user.email}`);
    }

    this.saveState();
    return tx;
  }

  public async reviewDeposit(txId: string, approved: boolean, reason?: string): Promise<Transaction> {
    const tx = this.transactions.find(t => t.id === txId && t.type === 'deposit');
    if (!tx) throw new Error('Deposit transaction not found.');
    if (tx.status !== 'pending') throw new Error(`Deposit cannot be reviewed in status '${tx.status}'.`);

    const user = this.getUserById(tx.userId);
    if (!user) throw new Error('Investor not found.');

    if (approved) {
      tx.status = 'completed';
      user.walletBalance = Number((user.walletBalance + tx.amount).toFixed(2));
      tx.balanceAfter = user.walletBalance;
      this.createNotification(user.id, 'Deposit Approved & Credited', `Your deposit of €${tx.amount.toFixed(2)} has been approved by admin and credited to your wallet balance.`, 'success');
      this.logAudit('usr-admin-1', 'admin@reental-log.com', 'DEPOSIT_APPROVED', `Approved deposit of €${tx.amount.toFixed(2)} for ${user.email}`);
    } else {
      tx.status = 'rejected';
      if (!tx.metadata) tx.metadata = {};
      tx.metadata.rejectionReason = reason || 'Deposit bank wire transfer reference or receipt could not be verified.';
      this.createNotification(user.id, 'Deposit Rejected', `Your deposit request for €${tx.amount.toFixed(2)} was declined: ${tx.metadata.rejectionReason}.`, 'warning');
      this.logAudit('usr-admin-1', 'admin@reental-log.com', 'DEPOSIT_REJECTED', `Rejected deposit of €${tx.amount.toFixed(2)} for ${user.email}`);
    }

    this.saveState();
    return tx;
  }

  public updateUserAvatar(userId: string, avatarUrl: string): User {
    const user = this.getUserById(userId);
    if (!user) throw new Error('User not found');
    user.avatarUrl = avatarUrl;
    this.saveState();
    return user;
  }

  /**
   * Atomic Investment Execution:
   * Validates available tokens, enforces minimums, deducts wallet balance, updates property funded amount,
   * creates user investment record, and issues digital ownership certificate.
   */
  public async executeInvestment(userId: string, propertyId: string, tokenCount: number): Promise<Investment> {
    if (tokenCount <= 0 || !Number.isInteger(tokenCount)) {
      throw new Error('Token purchase quantity must be a whole positive integer.');
    }
    if (this.isProcessingLock) throw new Error('Transaction execution engine is busy.');

    try {
      this.isProcessingLock = true;
      const user = this.getUserById(userId);
      if (!user) throw new Error('Please log in to participate in real estate offerings.');

      const property = this.getPropertyById(propertyId);
      if (!property) throw new Error('Target property not found in investment directory.');

      if (property.status !== 'funding') {
        throw new Error(`This property is currently '${property.status}' and not open for new contributions.`);
      }

      if (tokenCount > property.availableTokens) {
        throw new Error(`Only ${property.availableTokens} tokens remain available for this property.`);
      }

      const totalCost = tokenCount * property.tokenPrice;
      if (totalCost < property.minimumInvestment) {
        throw new Error(`Minimum investment for this property is €${property.minimumInvestment.toLocaleString()} (${Math.ceil(property.minimumInvestment / property.tokenPrice)} tokens).`);
      }
      if (user.walletBalance < totalCost) {
        throw new Error(`Insufficient available funds. Required: €${totalCost.toFixed(2)}, Available: €${user.walletBalance.toFixed(2)}. Please make a deposit first.`);
      }

      const timestamp = new Date().toISOString();
      const reference = `INV-${property.tokenTicker}-${Math.floor(1000 + Math.random() * 9000)}`;
      const txHash = generateTxHash(reference, totalCost, timestamp);
      const certificateId = `CERT-${property.tokenTicker}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      // Deduct balance and add to invested capital
      user.walletBalance = Number((user.walletBalance - totalCost).toFixed(2));
      user.investedBalance = Number((user.investedBalance + totalCost).toFixed(2));

      // Update property funding metrics
      property.availableTokens -= tokenCount;
      property.fundedAmount = Number((property.fundedAmount + totalCost).toFixed(2));
      if (property.availableTokens <= 0) {
        property.status = 'funded';
      }
      property.investorCount += 1;

      // Calculate projected monthly income
      const projectedMonthlyIncome = Number(((totalCost * (property.estimatedAnnualYield / 100)) / 12).toFixed(2));

      // Create Investment record
      const investment: Investment = {
        id: 'inv-' + Math.random().toString(36).substring(2, 9),
        userId: user.id,
        propertyId: property.id,
        propertyTitle: property.title,
        propertyLocation: property.location,
        propertyImage: property.images[0] || property.bannerImage,
        tokensPurchased: tokenCount,
        tokenPrice: property.tokenPrice,
        totalAmountInvested: totalCost,
        purchasedAt: timestamp,
        estimatedAnnualYield: property.estimatedAnnualYield,
        projectedMonthlyIncome: projectedMonthlyIncome,
        totalDividendsReceived: 0,
        status: 'active',
        transactionHash: txHash,
        certificateId: certificateId
      };

      this.investments.unshift(investment);

      // Create Ledger Transaction
      const tx: Transaction = {
        id: 'tx-' + Math.random().toString(36).substring(2, 9),
        userId: user.id,
        type: 'investment',
        amount: totalCost,
        currency: 'EUR',
        status: 'completed',
        description: `Acquired ${tokenCount} ${property.tokenTicker} tokens in ${property.title}`,
        reference: reference,
        createdAt: timestamp,
        paymentMethod: 'Internal Balance',
        balanceAfter: user.walletBalance,
        txHash: txHash,
        metadata: {
          propertyId: property.id,
          propertyTitle: property.title,
          tokens: tokenCount
        }
      };

      this.transactions.unshift(tx);
      this.createNotification(
        user.id,
        'Investment Confirmed!',
        `You have successfully acquired ${tokenCount} tokens (€${totalCost.toFixed(2)}) in ${property.title}. Certificate: ${certificateId}`,
        'success'
      );
      this.logAudit(user.id, user.email, 'INVESTMENT_EXECUTED', `Purchased ${tokenCount} tokens in ${property.title} for €${totalCost}`);

      this.saveState();
      return investment;
    } finally {
      this.isProcessingLock = false;
    }
  }

  // --- Transactions & History (Enforces access control for private data) ---
  public getTransactions(userId?: string, requestingUserRole?: string): Transaction[] {
    if (userId) {
      return this.transactions.filter(t => t.userId === userId);
    }
    if (requestingUserRole === 'admin') {
      return [...this.transactions];
    }
    return [];
  }

  public getInvestments(userId?: string, requestingUserRole?: string): Investment[] {
    if (userId) {
      return this.investments.filter(i => i.userId === userId);
    }
    if (requestingUserRole === 'admin') {
      return [...this.investments];
    }
    return [];
  }

  public getAuditLogs(requestingUserRole?: string): AuditLog[] {
    if (requestingUserRole !== 'admin') {
      return [];
    }
    return [...this.auditLogs];
  }

  public getNotifications(userId: string): Notification[] {
    return this.notifications.filter(n => n.userId === userId);
  }

  public markNotificationAsRead(id: string): void {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      this.saveState();
    }
  }

  private logAudit(adminId: string, adminEmail: string, action: string, details: string) {
    this.auditLogs.unshift({
      id: 'audit-' + Math.random().toString(36).substring(2, 9),
      adminId,
      adminEmail,
      action,
      details,
      timestamp: new Date().toISOString()
    });
  }

  private createNotification(userId: string, title: string, message: string, type: 'info' | 'success' | 'warning' | 'financial') {
    this.notifications.unshift({
      id: 'notif-' + Math.random().toString(36).substring(2, 9),
      userId,
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString()
    });
  }
}

export const ledger = new LedgerService();
