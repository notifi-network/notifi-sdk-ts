import { getAptosWallets, UserResponseStatus } from "@aptos-labs/wallet-standard";

let isInitialized = false
let mainContainer: HTMLElement

let { aptosWallets } = getAptosWallets();


export async function init() {
    // Prevent multiple initializations
    if (isInitialized) {
        console.warn('APTOS wallet already initialized')
        return
    }

    console.log('Initializing APTOS wallet...')
    isInitialized = true

    // Remove any existing containers
    const existingContainer = document.getElementById('aptos-wallet-container')
    existingContainer?.remove()

    // Create main container
    mainContainer = document.createElement('div')
    mainContainer.id = 'aptos-wallet-container'

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
    const existingList = document.querySelector('#aptos-wallet-list')
    existingList?.remove()

    const container = document.createElement('div')
    container.id = 'aptos-wallet-list'

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
      <h3>Select a APTOS wallet to connect:</h3>
      <div id="aptos-connector-list"></div>
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
      <textarea 
        id="nonce-input" 
        placeholder="Enter nonce"
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

    const list = container.querySelector('#aptos-connector-list')!
    const wallets = aptosWallets
    const withSignMessage = wallets.filter(w => w.features['aptos:signMessage'] !== undefined)

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
                const accountInfo = await (wallet).features['aptos:connect'].connect();
                if (accountInfo.status === UserResponseStatus.REJECTED) {
                    throw new Error('User rejected wallet connection')
                }

                document.getElementById('wallet-info')!.innerText = `Connected with ${wallet.name}`
                // Set initial user display
                document.getElementById('user')!.innerText = `Address: ${accountInfo.args.address}, Pubkey: ${accountInfo.args.publicKey.toString()}`

                // Hide wallet selection and show message section
                document.getElementById('wallet-selection')!.style.display = 'none'
                document.getElementById('message-section')!.style.display = 'block'

                document.getElementById('sign-button')?.addEventListener('click', async () => {
                    const message = (document.getElementById('message-input') as HTMLTextAreaElement).value
                    const nonce = (document.getElementById('nonce-input') as HTMLTextAreaElement).value
                    const outputArea = document.getElementById('signature-output') as HTMLTextAreaElement

                    if (message) {
                        try {
                            const signature = await wallet.features['aptos:signMessage'].signMessage({
                                address: true,
                                application: true,
                                chainId: true,
                                message,
                                nonce
                            })

                            if (signature.status === UserResponseStatus.REJECTED) {
                                throw new Error('User rejected message signing')
                            }



                            const outputText = JSON.stringify({
                                signedMessage: message,
                                signedFullMessage: signature.args.fullMessage,
                                signedFullMessageBase64: btoa(signature.args.fullMessage),
                                signatureHex: signature.args.signature.toString(),
                                nonce: signature.args.nonce
                            }, null, 2)

                            outputArea.value = outputText
                        } catch (error) {
                            outputArea.value = `Error signing message: ${error instanceof Error ? error.message : String(error)}`
                        }
                    }
                })

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
    const container = document.querySelector('#aptos-wallet-list')
    container?.remove()

    // Reset user display
    const userElement = document.getElementById('user')
    if (userElement) {
        userElement.innerText = 'Connect Wallet'
    }

    // Disconnect all wallets
    aptosWallets.forEach(wallet => {
        if (wallet.features['aptos:disconnect']) {
            wallet.features['aptos:disconnect'].disconnect()
                .catch(error => console.error('Error disconnecting wallet:', error))
        }
    })

    // Reset initialization flag
    isInitialized = false
}
