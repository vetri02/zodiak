import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SolanaWalletProvider } from '../components/SolanaWalletProvider'


function MyApp({ Component, pageProps }: AppProps) {

  return (
    
    <SolanaWalletProvider>
            <Component {...pageProps} />
    </SolanaWalletProvider>
  )
}

export default MyApp