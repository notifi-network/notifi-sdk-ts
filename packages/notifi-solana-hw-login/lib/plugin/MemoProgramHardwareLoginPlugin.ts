import type { WalletContextState } from '@solana/wallet-adapter-react';
import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  VersionedTransaction,
} from '@solana/web3.js';
import base58 from 'bs58';

export interface HardwareLoginPlugin {
  /**
   * @deprecated Use signTransacation() instead. We no longer have to send a txn, and instead simply rely on the signed TX as we can verify this on Notifi Services.
   */
  sendMessage?: (message: string) => Promise<string>;
  signTransaction: (message: string) => Promise<string>;
}

export type MemoProgramHardwareLoginPluginParams = Readonly<{
  walletPublicKey: string;
  connection: Connection;
  /**
   * @deprecated Use signMessage() instead. We no longer have to send a txn, and instead simply rely on the signed TX as we can verify this on Notifi Services.
   */
  sendTransaction?: WalletContextState['sendTransaction'];
  signTransaction: WalletContextState['signTransaction'];
}>;

export class MemoProgramHardwareLoginPlugin implements HardwareLoginPlugin {
  params: MemoProgramHardwareLoginPluginParams;

  constructor(params: MemoProgramHardwareLoginPluginParams) {
    this.params = params;
  }

  /**
   * @deprecated Use signMessage() instead. We no longer have to send a txn, and instead simply rely on the signed TX as we can verify this on Notifi Services.
   */
  sendMessage: (message: string) => Promise<string> = async (message) => {
    const { walletPublicKey, connection, sendTransaction } = this.params;

    if (!sendTransaction) {
      throw new Error('Wallet does not support transaction sending');
    }

    const publicKey = new PublicKey(walletPublicKey);
    const latestBlockHash = await connection.getLatestBlockhash();
    const txn = new Transaction();
    txn.recentBlockhash = latestBlockHash.blockhash;
    txn.feePayer = publicKey;
    txn.add(
      new TransactionInstruction({
        data: Buffer.from(message, 'utf-8'),
        keys: [
          {
            isSigner: true,
            isWritable: false,
            pubkey: publicKey,
          },
        ],
        programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
      }),
    );

    // Send transaction and wait for it to confirm
    const blockHashAgain = await connection.getLatestBlockhash();
    const signature = await sendTransaction(txn, connection);
    await connection.confirmTransaction({
      blockhash: blockHashAgain.blockhash,
      lastValidBlockHeight: blockHashAgain.lastValidBlockHeight,
      signature,
    });
    return signature;
  };

  signTransaction: (message: string) => Promise<string> = async (message) => {
    const { walletPublicKey, connection, signTransaction } = this.params;
    const MEMO_PROGRAM_ID = new PublicKey(
      'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr',
    );
    const publicKey = new PublicKey(walletPublicKey);
    const latestBlockHash = await connection.getLatestBlockhash();
    const txn = new Transaction();
    txn.recentBlockhash = latestBlockHash.blockhash;
    txn.feePayer = publicKey;

    txn.add(
      new TransactionInstruction({
        programId: MEMO_PROGRAM_ID,
        keys: [],
        data: Buffer.from(message, 'utf8'),
      }),
    );

    if (!signTransaction) {
      throw new Error('Wallet does not support transaction signing');
    }

    const signedTx = await signTransaction(txn);
    const signature = base58.encode(signedTx.signature as Buffer);
    return signature;
  };
}
