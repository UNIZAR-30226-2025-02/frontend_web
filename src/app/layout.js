import Link from "next/link";
import { AuthProvider } from "./components/AuthContext";
import './globals.css';

export default function Layout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon512.png" type="image/png" />
      </head>
      <body>
      <AuthProvider>
        {children}
        </AuthProvider>
      </body>
    </html>
  );
}
