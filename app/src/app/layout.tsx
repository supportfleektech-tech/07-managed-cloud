import './globals.css';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = { title: 'Managed Cloud', description: 'KENYA254 Managed Cloud & Migration' };
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#0b0f14' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="top">
          <strong>☁️ Managed Cloud</strong>
          <nav>
            <a href="/">Dashboard</a>
            <a href="/customers">Customers</a>
            <a href="/environments">Environments</a>
            <a href="/migrations">Migrations</a>
          </nav>
        </header>
        <main className="wrap">{children}</main>
        <footer className="foot">KENYA254 · Managed Cloud · dev</footer>
      </body>
    </html>
  );
}
