import './global.css';

export const metadata = {
  title: 'WalletSpace',
  description: 'Manage and share your shared finance',
  openGraph: {
    title: 'WalletSpace',
    description: 'Manage and share your shared finance',
    type: 'website',
    locale: 'en_IE',
    url: 'https://wallet-space.com/',
    site_name: 'WalletSpace',
    images: [
      {
        url: 'https://wallet-space.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'WalletSpace',
      },
    ],
  },
  appleWebAppCapable: 'yes',
  appleMobileWebAppStatusBarStyle: 'white',
  appleMobileWebAppTitle: 'WalletSpace',
  mobileWebAppCapable: 'yes',
  mobileWebAppStatusBarStyle: 'white',
  msapplicationTileColor: '#ffffff',
  msapplicationTileImage: '/mstile-144x144.png',
  favicon: '/favicon.ico',
  keywords: 'shared finance, shared spending, shared expenses, shared budget',
  twitter: {
    cardType: 'summary_large_image',
    site: '@thewalletspace',
    handle: '@thewalletspace',
  },
  viewPort: {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#ffffff',
  },
  // facebook: {
  //   appId: '1234567890',
  // },
  canonical: 'https://wallet-space.com/',
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
