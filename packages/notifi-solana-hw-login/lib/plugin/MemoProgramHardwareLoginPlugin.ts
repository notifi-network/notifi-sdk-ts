import type { WalletContextState } from '@solana/wallet-adapter-react';
import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';

export interface HardwareLoginPlugin {
  sendMessage: (message: string) => Promise<string>;
}

export type MemoProgramHardwareLoginPluginParams = Readonly<{
  walletPublicKey: string;
  connection: Connection;
  sendTransaction: WalletContextState['sendTransaction'];
  signTransaction: WalletContextState['signTransaction'];
}>;

export class MemoProgramHardwareLoginPlugin implements HardwareLoginPlugin {
  params: MemoProgramHardwareLoginPluginParams;

  constructor(params: MemoProgramHardwareLoginPluginParams) {
    this.params = params;
  }

  sendMessage: (message: string) => Promise<string> = async (message) => {
    const { walletPublicKey, connection, signTransaction } = this.params;

    const MEMO_PROGRAM_ID = new PublicKey(
      'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr',
    );
    const publicKey = new PublicKey(walletPublicKey);
    const latestBlockHash = await connection.getLatestBlockhash();
    const txn = new Transaction();

    txn.add(
      new TransactionInstruction({
        programId: MEMO_PROGRAM_ID,
        keys: [],
        data: Buffer.from(message, 'utf8'),
      }),
    );

    txn.feePayer = publicKey;
    txn.recentBlockhash = latestBlockHash.blockhash;
    // Send transaction and wait for it to confirm
    if (!signTransaction) {
      throw new Error('Wallet does not support transaction signing');
    }
    const signedTx = await signTransaction(txn);
    const serializedTx = signedTx.serialize();

    const base64Tx = Buffer.from(serializedTx).toString('base64');
    return base64Tx;
  };
}
