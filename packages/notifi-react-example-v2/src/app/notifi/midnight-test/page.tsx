'use client';

import { useWallets } from '@notifi-network/notifi-wallet-provider';
import { useState } from 'react';

export default function LaceTestPage() {
  const { wallets, selectedWallet } = useWallets();
  const [signatureResult, setSignatureResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const isCardanoWallet =
    selectedWallet === 'lace' ||
    selectedWallet === 'eternl' ||
    selectedWallet === 'nufi';

  const handleSignMessage = async () => {
    if (!selectedWallet || !isCardanoWallet) {
      alert('Please connect to a Cardano wallet (Lace, Eternl, or Nufi) first');
      return;
    }

    const cardanoWallet = wallets[selectedWallet];
    if (!cardanoWallet.signArbitrary) {
      alert('Sign function not available');
      return;
    }

    setIsLoading(true);
    try {
      console.log('🔥 Signing message: "hello notifi"');
      const signature = await cardanoWallet.signArbitrary('hello notifi');
      console.log('✅ Signature result:', signature);
      setSignatureResult(
        JSON.stringify(signature, null, 2) || 'No signature returned',
      );
    } catch (error) {
      console.error('❌ Signing failed:', error);
      alert(`Signing failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>🌙 Cardano Wallet Test (Lace/Eternl/Nufi - Midnight Network)</h1>

      <div style={{ marginBottom: '20px' }}>
        <h3>Wallet Status:</h3>
        <p>
          <strong>Selected Wallet:</strong> {selectedWallet || 'None'}
        </p>
        <p>
          <strong>Is Cardano Wallet:</strong>{' '}
          {isCardanoWallet ? '✅ Yes' : '❌ No'}
        </p>
        {isCardanoWallet && (
          <div>
            <p>
              <strong>Wallet Keys:</strong>
            </p>
            <pre
              style={{
                background: '#f5f5f5',
                padding: '10px',
                fontSize: '12px',
              }}
            >
              {JSON.stringify(wallets[selectedWallet].walletKeys, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Test Signing:</h3>
        <button
          onClick={handleSignMessage}
          disabled={isLoading || !isCardanoWallet}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: isCardanoWallet ? '#007bff' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isCardanoWallet ? 'pointer' : 'not-allowed',
          }}
        >
          {isLoading ? '🔄 Signing...' : '✍️ Sign "hello notifi"'}
        </button>
      </div>

      {signatureResult && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Signature Result:</h3>
          <textarea
            value={signatureResult}
            readOnly
            style={{
              width: '100%',
              height: '150px',
              fontFamily: 'monospace',
              fontSize: '12px',
              padding: '10px',
            }}
          />
        </div>
      )}

      <div
        style={{
          marginTop: '40px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '5px',
        }}
      >
        <h4>📋 Instructions:</h4>
        <ol>
          <li>
            Go back to <a href="/">home page</a> and connect to a Cardano wallet
            (Lace or Eternl)
          </li>
          <li>Return to this page via the Notifi pages</li>
          <li>Click the "Sign hello notifi" button</li>
          <li>Approve the signature in your wallet</li>
          <li>See the signature result below</li>
        </ol>
      </div>
    </div>
  );
}
