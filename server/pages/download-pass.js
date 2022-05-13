import { Provider, createClient } from 'wagmi'

const client = createClient()

function App() {
  return (
    <Provider client={client}>
      <Profile />
    </Provider>
  )
}

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

function Profile() {
  const { data } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const { disconnect } = useDisconnect()

  if (data)
    return (
      <div>
        Connected to {data.address}
        <button onClick={() => disconnect()}>Disconnect</button>
      </div>
    )
  return <button onClick={() => connect()}>Connect Wallet</button>
}

export default function DownloadPass() {
    console.log('/download-pass')
    return (
        <div className="container">
            <main>
                <h1 className="title">
                    Download Pass
                </h1>

                <App />
                
                <p></p>

                <a href="/api/downloadPass">
                    <button>
                        Download Pass
                    </button>
                </a>
            </main>
        </div>
    )
}
