export interface IAccount {
  address: string;
  seed: string;
}

export interface IConfiguration {
  contractAddress: string | null;
  contractSeed: string | null;
  csvPath: string;

  isConfigured(): boolean;
}

export interface IRecipient {
  recipient: string;
  amount: number;
}

export interface ITransferToken {
  amount: number;
  assetId: string | null;
}
