import { Logger, WalletManager } from '@cosmos-kit/core';
import { wallets as keplrWallets } from '@cosmos-kit/keplr';
import { wallets as leapWallets } from '@cosmos-kit/leap';
import { wallets as stationWallets } from '@cosmos-kit/station';
import { assets } from 'chain-registry';

let isInitialized = false;
let mainContainer: HTMLElement;
let walletManager: WalletManager;

export async function init() {
  // Prevent multiple initializations
  if (isInitialized) {
    console.warn('Cosmos wallet already initialized');
    return;
  }

  console.log('Initializing Cosmos wallet...');
  isInitialized = true;

  // Initialize wallet manager
  walletManager = new WalletManager(
    ['cosmoshub', 'juno', 'stargaze', 'osmosis'],
    [keplrWallets[0], leapWallets[0], stationWallets[0]],
    new Logger('NONE'),
    false,
    undefined,
    undefined,
    assets,
  );

  // Remove any existing containers
  const existingContainer = document.getElementById('cosmos-wallet-container');
  existingContainer?.remove();

  // Create main container
  mainContainer = document.createElement('div');
  mainContainer.id = 'cosmos-wallet-container';

  // Create connect button
  let btnEl = document.getElementById('connect') as HTMLButtonElement;
  if (!btnEl) {
    btnEl = document.createElement('button');
    btnEl.id = 'connect';
  }
  btnEl.innerText = 'Connect';

  const userEl = document.createElement('div');
  userEl.id = 'user';

  mainContainer.append(btnEl, userEl);
  document.body.appendChild(mainContainer);

  btnEl.addEventListener('click', handleConnect);
}

async function handleConnect() {
  const existingList = document.querySelector('#cosmos-wallet-list');
  existingList?.remove();

  const container = document.createElement('div');
  container.id = 'cosmos-wallet-list';

  Object.assign(container.style, {
    padding: '20px',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '8px',
    maxWidth: '600px',
    margin: '20px auto',
  });

  // Create wallet table
  container.innerHTML = `
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="border: 1px solid #ccc; padding: 8px;">Wallet</th>
          <th style="border: 1px solid #ccc; padding: 8px;">Connect</th>
          <th style="border: 1px solid #ccc; padding: 8px;">Disconnect</th>
          <th style="border: 1px solid #ccc; padding: 8px;">Chain</th>
          <th style="border: 1px solid #ccc; padding: 8px;">Address</th>
          <th style="border: 1px solid #ccc; padding: 8px;">Sign</th>
        </tr>
      </thead>
      <tbody id="wallet-list"></tbody>
    </table>
  `;

  // Modify the message input section to include the results textarea
  container.innerHTML += `
    <div style="margin-top: 20px;">
      <input type="text" id="message-input" placeholder="Enter message to sign" style="width: 100%; padding: 8px; margin-bottom: 10px;">
      <textarea id="signature-results" readonly style="width: 100%; height: 120px; padding: 8px; margin-top: 10px; font-family: monospace;"
        placeholder="Signature results will appear here..."></textarea>
    </div>
  `;

  const tbody = container.querySelector('#wallet-list')!;
  const mainWallets = walletManager.mainWallets;

  for (const mainWallet of mainWallets) {
    const chainWallets = mainWallet.getChainWalletList(false);

    chainWallets.forEach((wallet, index) => {
      const row = document.createElement('tr');

      if (index === 0) {
        row.innerHTML = `
          <td style="border: 1px solid #ccc; padding: 8px;" rowspan="${chainWallets.length}">${wallet.walletName}</td>
          <td style="border: 1px solid #ccc; padding: 8px;" rowspan="${chainWallets.length}">
            <button class="connect-btn">Connect All</button>
          </td>
          <td style="border: 1px solid #ccc; padding: 8px;" rowspan="${chainWallets.length}">
            <button class="disconnect-btn">Disconnect All</button>
          </td>
          <td style="border: 1px solid #ccc; padding: 8px;">${wallet.chainName}</td>
          <td style="border: 1px solid #ccc; padding: 8px;" class="address-cell">${wallet.address || '-'}</td>
          <td style="border: 1px solid #ccc; padding: 8px;">
            <button class="sign-btn" ${!wallet.address ? 'disabled' : ''}>Sign Message</button>
          </td>
        `;

        // Add connect/disconnect handlers
        const connectBtn = row.querySelector('.connect-btn')!;
        const disconnectBtn = row.querySelector('.disconnect-btn')!;

        connectBtn.addEventListener('click', async () => {
          await mainWallet.connectAll(false);
          updateAddresses(container, mainWallet);
        });

        disconnectBtn.addEventListener('click', async () => {
          await mainWallet.disconnectAll(false);
          updateAddresses(container, mainWallet);
        });
      } else {
        row.innerHTML = `
          <td style="border: 1px solid #ccc; padding: 8px;">${wallet.chainName}</td>
          <td style="border: 1px solid #ccc; padding: 8px;" class="address-cell">${wallet.address || '-'}</td>
          <td style="border: 1px solid #ccc; padding: 8px;">
            <button class="sign-btn" ${!wallet.address ? 'disabled' : ''}>Sign Message</button>
          </td>
        `;
      }

      // Update the sign message handler
      const signBtn = row.querySelector('.sign-btn') as HTMLButtonElement;
      signBtn.addEventListener('click', async () => {
        const messageInput = container.querySelector(
          '#message-input',
        ) as HTMLInputElement | null;
        const resultsArea = container.querySelector(
          '#signature-results',
        ) as HTMLTextAreaElement | null;

        if (!messageInput || !resultsArea) {
          console.error('Required elements not found');
          return;
        }

        const message = messageInput.value;
        if (!message) {
          alert('Please enter a message to sign');
          return;
        }

        try {
          signBtn.disabled = true;
          signBtn.textContent = 'Signing...';

          // Get the public key first
          const pubKey = await wallet.client.getAccount(wallet.chainId);

          const signature = await wallet.client.signArbitrary!(
            wallet.chainId,
            wallet.address!,
            message,
          );

          // Create results object
          const results = {
            message: message,
            messageBase64: btoa(message),
            signatureBase64: signature.signature,
            pubkey: Buffer.from(pubKey.pubkey).toString('base64'),
            address: wallet.address,
            chainId: wallet.chainId,
          };

          // Update textarea value
          resultsArea.value = JSON.stringify(results, null, 2);

          console.log('Message signed successfully:', results);
        } catch (error) {
          console.error('Failed to sign message:', error);
          alert('Failed to sign message: ' + (error as Error).message);
        } finally {
          if (!wallet.address) {
            signBtn.disabled = true;
          } else {
            signBtn.disabled = false;
          }
          signBtn.textContent = 'Sign Message';
        }
      });

      tbody.appendChild(row);
    });
  }

  mainContainer.appendChild(container);
}

function updateAddresses(container: HTMLElement, mainWallet: any) {
  const chainWallets = mainWallet.getChainWalletList(false);
  const rows = container.querySelectorAll('tr');

  chainWallets.forEach((wallet, index) => {
    const row = rows[index + 1]; // +1 to skip header row
    if (row) {
      const addressCell = row.querySelector('.address-cell');
      const signBtn = row.querySelector('.sign-btn') as HTMLButtonElement;

      if (addressCell) {
        addressCell.textContent = wallet.address || '-';
      }
      if (signBtn) {
        signBtn.disabled = !wallet.address;
      }
    }
  });
}

export function cleanup() {
  const container = document.querySelector('#cosmos-wallet-list');
  container?.remove();

  const userElement = document.getElementById('user');
  if (userElement) {
    userElement.innerText = '';
  }

  // Disconnect all wallets
  if (walletManager) {
    walletManager.mainWallets.forEach((wallet) => {
      wallet.disconnectAll(false).catch(console.error);
    });
  }

  isInitialized = false;
}
