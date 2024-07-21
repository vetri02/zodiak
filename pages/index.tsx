import type { NextPage } from 'next'
import Head from 'next/head'
import ZodiacFinder from '../components/ZodiacFinder'
import { useEffect, useState } from 'react'

const Home: NextPage = () => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <>
      <Head>
        <title>Zodiak - Astrology Sign Finder</title>
        <meta name="description" content="Find your astrological sign based on your birth date" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen">
        <ZodiacFinder />
      </main>
    </>
  )
}

export default Home