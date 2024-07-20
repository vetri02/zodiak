import dynamic from 'next/dynamic';

const BuyZodiacCoin = dynamic(() => import('./BuyZodiacCoin'), {
  ssr: false,
});

export default BuyZodiacCoin;