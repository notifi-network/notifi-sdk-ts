import { getWallets } from '@mysten/wallet-standard';

let isInitialized = false
let mainContainer: HTMLElement

export async function init() {
  // Prevent multiple initializations
  if (isInitialized) {
    console.warn('SUI wallet already initialized')
    return
  }

  console.log('Initializing SUI wallet...')
  isInitialized = true

  // Remove any existing containers
  const existingContainer = document.getElementById('sui-wallet-container')
  existingContainer?.remove()

  // Create main container
  mainContainer = document.createElement('div')
  mainContainer.id = 'sui-wallet-container'

  // Create or get connect button
  let btnEl = document.getElementById('connect') as HTMLButtonElement
  if (!btnEl) {
    btnEl = document.createElement('button')
    btnEl.id = 'connect'
  }
  btnEl.innerText = 'Connect'

  const userEl = document.createElement('div')
  userEl.id = 'user'

  mainContainer.append(btnEl, userEl)
  document.body.appendChild(mainContainer)

  // Add connect button listener
  btnEl.addEventListener('click', handleConnect)
}

async function handleConnect() {
  // Remove any existing wallet list
  const existingList = document.querySelector('#sui-wallet-list')
  existingList?.remove()

  const container = document.createElement('div')
  container.id = 'sui-wallet-list'
  
  // Style container similar to EVM
  Object.assign(container.style, {
    padding: '20px',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '8px',
    maxWidth: '300px',
    margin: '20px auto'
  })

  container.innerHTML = `
    <div id="wallet-selection">
      <h3>Select a SUI wallet to connect:</h3>
      <div id="sui-connector-list"></div>
    </div>
    <div id="message-section" style="display: none">
      <div style="margin-bottom: 15px;">
        <div id="wallet-info" style="font-size: 14px; color: #666;"></div>
        <div id="address-info" style="font-size: 14px; word-break: break-all;"></div>
      </div>
      <textarea 
        id="message-input" 
        placeholder="Enter message to sign"
        style="width: 100%; margin: 10px 0; padding: 8px;"
      ></textarea>
      <button id="sign-button" style="width: 100%; padding: 10px;">Sign Message</button>
      <textarea 
        id="signature-output" 
        readonly
        style="width: 100%; height: 150px; margin: 10px 0; padding: 8px; font-family: monospace;"
      ></textarea>
    </div>
  `

  const list = container.querySelector('#sui-connector-list')!
  const wallets = getWallets().get()
  const withSignMessage = wallets.filter(w => w.features['sui:signMessage'] !== undefined)

  withSignMessage.forEach(wallet => {
    const button = document.createElement('button')
    button.innerText = wallet.name
    Object.assign(button.style, {
      display: 'block',
      width: '100%',
      margin: '8px 0',
      padding: '10px',
      cursor: 'pointer',
      borderRadius: '4px',
      border: '1px solid #ccc'
    })
    button.addEventListener('click', async () => {
      try {
        (wallet).features['standard:connect'].connect();
        const accounts = wallet.accounts
        if (accounts.length > 0) {
          // Create account selection dropdown
          const accountSelect = document.createElement('select')
          accountSelect.id = 'account-select'
          Object.assign(accountSelect.style, {
            width: '100%',
            padding: '8px',
            marginBottom: '10px'
          })
          
          accounts.forEach(account => {
            const option = document.createElement('option')
            option.value = account.address
            option.text = `${account.address.slice(0, 6)}...${account.address.slice(-4)}`
            accountSelect.appendChild(option)
          })

          document.getElementById('wallet-info')!.innerText = `Connected with ${wallet.name}`
          document.getElementById('address-info')!.innerHTML = 'Select account: '
          document.getElementById('address-info')!.appendChild(accountSelect)
          
          // Update user display when account changes
          accountSelect.addEventListener('change', (e) => {
            const selectedAddress = (e.target as HTMLSelectElement).value
            document.getElementById('user')!.innerText = `Connected: ${selectedAddress}`
          })
          
          // Set initial user display
          document.getElementById('user')!.innerText = `Connected: ${accounts[0].address}`
          
          // Hide wallet selection and show message section
          document.getElementById('wallet-selection')!.style.display = 'none'
          document.getElementById('message-section')!.style.display = 'block'
        
          document.getElementById('sign-button')?.addEventListener('click', async () => {
            const message = (document.getElementById('message-input') as HTMLTextAreaElement).value
            const selectedAddress = (document.getElementById('account-select') as HTMLSelectElement).value
            const selectedAccount = accounts.find(acc => acc.address === selectedAddress)!
            const outputArea = document.getElementById('signature-output') as HTMLTextAreaElement
            
            if (message) {
              try {
                const signature = await wallet.features['sui:signMessage'].signMessage({
                  message: new TextEncoder().encode(message),
                  account: selectedAccount
                })
                
                const outputText = JSON.stringify({
                  signedMessage: message,
                  signedMessageBase64: signature.messageBytes,
                  signatureBase64: signature.signature
                }, null, 2)
                
                outputArea.value = outputText
              } catch (error) {
                outputArea.value = `Error signing message: ${error instanceof Error ? error.message : String(error)}`
              }
            }
          })
        }
      } catch (error) {
        console.error('Failed to connect wallet:', error)
      }
    })
    list.appendChild(button)
  })
  
  mainContainer.appendChild(container)
}

export function cleanup() {
  // Remove UI container
  const container = document.querySelector('#sui-wallet-list')
  container?.remove()
  
  // Reset user display
  const userElement = document.getElementById('user')
  if (userElement) {
    userElement.innerText = 'Connect Wallet'
  }

  // Disconnect all wallets
  getWallets().get().forEach(wallet => {
    if (wallet?.features['standard:disconnect']) {
      try {
        wallet.features['standard:disconnect'].disconnect()
      } catch (error) {
        console.error('Error disconnecting wallet:', error)
      }
    }
  })

  // Reset initialization flag
  isInitialized = false
}
