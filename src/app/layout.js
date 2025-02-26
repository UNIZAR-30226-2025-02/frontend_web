import Link from "next/link";

export default function Layout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon512.png" type="image/png" />
      </head>
      <body>
        <nav>
          <ul>
            <li><Link href="/">Inicio</Link></li>
            <li><Link href="/about">Sobre Nosotros</Link></li>
            <li><Link href="/contact">Contacto</Link></li>
          </ul>
        </nav>
        {children}
      </body>
    </html>
  );
}
