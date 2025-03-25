import './globals.css';

export const metadata = {
  title: 'Naturalys',
  description: 'A melhor loja de produtos Naturais e suplementos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen bg-white">
        {children}
      </body>
    </html>
  );
} 