import ModernWeb3Chat from '@/components/ModernWeb3Chat'
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react'
import { PetraWallet } from 'petra-plugin-wallet-adapter';
const wallets = [new PetraWallet()];

export default function Home() {
  return (
    <main className="min-h-screen">
      <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
        <ModernWeb3Chat />
      </AptosWalletAdapterProvider>
    </main>
  )
}