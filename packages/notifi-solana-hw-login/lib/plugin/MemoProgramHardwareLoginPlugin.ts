import { HardwareLoginPlugin } from '@notifi-network/notifi-react-card';
import type { WalletContextState } from '@solana/wallet-adapter-react';
import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';

type MemoProgramHardwareLoginPluginParams = Readonly<{
  walletPublicKey: string;
  connection: Connection;
  sendTransaction: WalletContextState['sendTransaction'];
}>;

export class MemoProgramHardwareLoginPlugin implements HardwareLoginPlugin {
  params: MemoProgramHardwareLoginPluginParams;

  constructor(params: MemoProgramHardwareLoginPluginParams) {
    this.params = params;
  }

  sendMessage: (message: string) => Promise<string> = async (message) => {
    const { walletPublicKey, connection, sendTransaction } = this.params;

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
}
