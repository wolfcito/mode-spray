import React from 'react'
import Head from 'next/head'

type MetaHeaderProps = {
  title?: string
  description?: string
  image?: string
  twitterCard?: string
  children?: React.ReactNode
}

const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/` : '/'

export const MetaHeader = ({
  title = 'Mode Spray',
  description = 'Spray Tokens ERC20 or Ether to multiple wallet addresses in a single click.',
  image = 'thumbnail.png',
  twitterCard = 'summary_large_image',
  children,
}: MetaHeaderProps) => {
  const imageUrl = baseUrl + image

  return (
    <Head>
      {title && (
        <>
          <title>{title}</title>
          <meta property="og:title" content={title} />
          <meta name="twitter:title" content={title} />
        </>
      )}
      {description && (
        <>
          <meta name="description" content={description} />
          <meta property="og:description" content={description} />
          <meta name="twitter:description" content={description} />
        </>
      )}
      {image && (
        <>
          <meta property="og:image" content={imageUrl} />
          <meta name="twitter:image" content={imageUrl} />
        </>
      )}
      {twitterCard && <meta name="twitter:card" content={twitterCard} />}
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
      <link rel="manifest" href="/manifest.json" />
      {children}
    </Head>
  )
}
