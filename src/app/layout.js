import Link from "next/link";
import './globals.css';

export default function Layout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon512.png" type="image/png" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
