export const WALLET_CONFIG = {
    // Message template for signing
    getSignMessage: (address: string, nonce: string) => {
        return `Welcome to DropOps!

Sign this message to verify your wallet ownership.

Wallet: ${address}
Nonce: ${nonce}
Timestamp: ${new Date().toISOString()}

This signature does not trigger a blockchain transaction or cost any gas fees.`;
    },

    // Generate a random nonce
    generateNonce: () => {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    },

    // Session storage key
    SESSION_KEY: 'dropops_wallet_session',
};

export interface WalletSession {
    address: string;
    connectedAt: number;
}
