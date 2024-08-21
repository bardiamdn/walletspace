import './global.css';

export const metadata = {
  title: 'WalletSpace',
  description: 'Manage and share your shared finance',
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
