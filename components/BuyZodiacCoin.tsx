import React, { FC, useEffect, useMemo, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey, VersionedTransaction, Connection } from '@solana/web3.js';
import toast, { Toaster } from 'react-hot-toast';


interface Props {
  zodiacSign: string;
}

const CUSTOM_RPC_URL = 'https://mainnet.helius-rpc.com/?api-key=e2321ab2-8141-4ec2-8c16-abef82ab2724';

export const BuyZodiacCoin: FC<Props> = ({ zodiacSign }) => {
  const connection = useMemo(() => new Connection(CUSTOM_RPC_URL), []);
  const { publicKey, wallet } = useWallet();
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log(wallet ? 'Wallet:' : 'Wallet is undefined', wallet);
    }
  }, [wallet]);

  const ZodiacCoinList = {
    Capricorn: "3C2SN1FjzE9MiLFFVRp7Jhkp8Gjwpk29S2TCSJ2jkHn2",
    Aquarius: "C49Ut3om3QFTDrMZ5Cr8VcTKPpHDcQ2Fv8mmuJHHigDt",
    Pisces: "3JsSsmGzjWDNe9XCw2L9vznC5JU9wSqQeB6ns5pAkPeE",
    Aries: "GhFiFrExPY3proVF96oth1gESWA5QPQzdtb8cy8b1YZv",
    Taurus: "EjkkxYpfSwS6TAtKKuiJuNMMngYvumc1t1v9ZX1WJKMp",
    Gemini: "ARiZfq6dK19uNqxWyRudhbM2MswLyYhVUHdndGkffdGc",
    Cancer: "CmomKM8iPKRSMN7y1jqyW1QKj5bGoZmbvNZXWBJSUdnZ",
    Leo: "8Cd7wXoPb5Yt9cUGtmHNqAEmpMDrhfcVqnGbLC48b8Qm",
    Virgo: "Ez4bst5qu5uqX3AntYWUdafw9XvtFeJ3gugytKKbSJso",
    Libra: "7Zt2KUh5mkpEpPGcNcFy51aGkh9Ycb5ELcqRH1n2GmAe",
    Scorpio: "J4fQTRN13MKpXhVE74t99msKJLbrjegjEgLBnzEv2YH1",
    Sagittarius: "8x17zMmVjJxqswjX4hNpxVPc7Tr5UabVJF3kv8TKq8Y3",
  };

  const buyMemecoin = async () => {
    if (!publicKey) {
      alert('Please connect your wallet first!');
      return;
    }

    if (!wallet) {
      alert('Wallet is not properly initialized. Please try reconnecting.');
      return;
    }

    setIsPurchasing(true);

    try {
      const tokenMint = new PublicKey(ZodiacCoinList[zodiacSign]);
      const amount = 10000000; // 0.01
      const quoteResponse = await fetch(`https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=${tokenMint}&amount=${amount}&slippageBps=1`).then(res => res.json());
  
      console.log('Quote Response:', quoteResponse);

      const inAmountInSol = quoteResponse.inAmount / 1000000000; // 1 SOL = 1,000,000,000 lamports
      console.log(`Input amount (SOL): ${inAmountInSol}`);
  
      const swapResponse = await fetch('https://quote-api.jup.ag/v6/swap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userPublicKey: publicKey.toString(),
          quoteResponse,
        })
      }).then(res => res.json());

      const { swapTransaction } = swapResponse;
      const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

      const txid = await wallet.adapter.sendTransaction(transaction, connection);
      console.log('Transaction successful with txid:', txid);
      toast.success(`Congratulations! You've purchased ${zodiacSign} memecoin!`);
    } catch (error) {
      console.error('Error buying memecoin:', error);
      toast.error('Failed to purchase memecoin. Please try again.');
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <div className="flex justify-center flex-col w-full">
      <Toaster position="bottom-right" toastOptions={{
    className: 'border text-black',
    duration: 3000,
  }}/>
    {!publicKey && (
      <div className="text-center text-zinc-700">
        Please connect your wallet to buy {zodiacSign} Memecoin.
      </div>
    )}
    <div className={`flex mb-4 pt-2 ${publicKey ? 'justify-end' : 'justify-center'}`}>
      <WalletMultiButton  style={{
      backgroundColor: '#fff', // blue-500
      color: '#000',
      padding: '0.5rem 1rem', // py-2 px-4
      borderRadius: '0.25rem', // rounded
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      border: '1px solid #000',
      fontFamily: 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      transition: 'background-color 0.2s ease-in-out',
    }}/>
    </div>
    {publicKey && (
      <button
        onClick={buyMemecoin}
        disabled={isPurchasing}
        className="inline-flex rounded items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-900 text-white hover:bg-gray-900/90 h-10 px-4 py-2 w-full"
      >
        {isPurchasing ? 'Purchasing...' : `Buy ${zodiacSign} Memecoin (0.01 SOL worth)`}
      </button>
    )}
  </div>
  );
};

export default BuyZodiacCoin;