import { initW3, Injected, connectW3, getW3, subW3, disconnectW3 } from '@w3vm/core'
import { createWalletClient, custom, Hex } from 'viem'
import { mainnet } from 'viem/chains'

let mainContainer: HTMLDivElement | null = null
let unsubscribe: (() => void) | null = null
let isInitialized = false

export function init() {
  // Prevent multiple initializations
  if (isInitialized) {
    console.warn('EVM wallet already initialized')
    return
  }
  
  console.log('Initializing EVM wallet...')
  isInitialized = true

  // Remove any existing containers first
  const existingContainer = document.getElementById('evm-wallet-container')
  existingContainer?.remove()

  // Create main container
  mainContainer = document.createElement('div')
  mainContainer.id = 'evm-wallet-container'
  
  // Get existing connect button
  const btnEl = document.getElementById('connect') as HTMLButtonElement
  btnEl.innerText = 'Connect'
  
  const userEl = document.createElement('div')
  userEl.id = 'user'
  
  mainContainer.append(btnEl, userEl)
  document.body.appendChild(mainContainer)

  // Initialize web3
  initW3({
    connectors: [new Injected()]
  })

  // Set up address subscription
  unsubscribe = subW3.address(async address => {
    if (address) {
      btnEl.innerText = "Disconnect"
      userEl.innerText = `Address: ${address}`
      createSigningInterface(address)
    } else {
      btnEl.innerText = "Connect"
      userEl.innerText = ""
      // Remove signing interface if it exists
      const signingInterface = document.querySelector('#signing-interface')
      signingInterface?.remove()
    }
  })

  // Add connect button listener
  btnEl.addEventListener('click', handleConnect)
}

export function cleanup() {
  if (!isInitialized) return

  console.log('Cleaning up EVM wallet...')
  if (unsubscribe) {
    unsubscribe()
    unsubscribe = null
  }
  if (mainContainer) {
    mainContainer.remove()
    mainContainer = null
  }
  isInitialized = false
}

function createSigningInterface(address: string) {
  // Remove existing signing interface if it exists
  const existingInterface = mainContainer?.querySelector('#signing-interface')
  existingInterface?.remove()

  const signingContainer = document.createElement('div')
  signingContainer.id = 'signing-interface'

  const messageInput = document.createElement('input')
  const signButton = document.createElement('button')
  const resultArea = document.createElement('textarea')

  // Set up input
  Object.assign(messageInput, {
    type: 'text',
    placeholder: 'Enter message to sign',
    style: {
      padding: '8px',
      marginRight: '8px',
      width: '200px'
    }
  })

  // Set up button
  Object.assign(signButton, {
    innerText: 'Sign Message',
    style: {
      padding: '8px 16px'
    }
  })

  // Set up result area
  Object.assign(resultArea.style, {
    width: '100%',
    height: '100px',
    marginTop: '16px',
    padding: '8px'
  })
  resultArea.readOnly = true

  // Add signing functionality
  signButton.addEventListener('click', async () => {
    try {
      const message = messageInput.value
      if (!message) return

      const w3Provider = getW3.walletProvider()
      if (!w3Provider) throw new Error('User not connected')

      const client = createWalletClient({
        chain: mainnet,
        transport: custom(w3Provider)
      })

      const signature = await client.signMessage({
        account: address as Hex,
        message
      })

      resultArea.value = JSON.stringify({
        signedMessage: message,
        signatureHex: signature,
        walletAddress: address
      }, null, 2)
    } catch (error) {
      console.error('Signing failed:', error)
      resultArea.value = 'Error signing message'
    }
  })

  signingContainer.append(messageInput, signButton, resultArea)
  mainContainer?.appendChild(signingContainer)
}

function handleConnect() {
  // Remove any existing connector UI
  const existingConnector = document.querySelector('#wallet-connector-container')
  existingConnector?.remove()

  const address = getW3.address()
  if (address) {
    disconnectW3()
    return
  }

  const container = document.createElement('div')
  container.id = 'wallet-connector-container'
  const connectors = getW3.connectors()
  
  // Create wallet selection UI
  container.innerHTML = `
    <h3>Select a wallet to connect:</h3>
    <div id="connector-list"></div>
  `
  
  // Style container
  Object.assign(container.style, {
    padding: '20px',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '8px',
    maxWidth: '300px',
    margin: '20px auto'
  })

  // Add connector buttons
  const list = container.querySelector('#connector-list')!
  connectors.forEach(connector => {
    const button = document.createElement('button')
    button.innerText = connector.name
    Object.assign(button.style, {
      display: 'block',
      width: '100%',
      margin: '8px 0',
      padding: '10px',
      cursor: 'pointer',
      borderRadius: '4px',
      border: '1px solid #ccc'
    })
    button.addEventListener('click', () => {
      connectW3({ connector })
      container.remove()
    })
    list.appendChild(button)
  })

  mainContainer?.appendChild(container)
}

