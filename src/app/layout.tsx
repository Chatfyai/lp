import './globals.css';

export const metadata = {
  title: 'Minha Loja Online',
  description: 'Uma loja online com belos produtos',
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
      </head>
      <body className="min-h-screen bg-white">
        {children}
      </body>
    </html>
  );
} 