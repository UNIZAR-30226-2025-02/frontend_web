import Header from "../components/header"; // Asegúrate de la ruta correcta

export default function Layout({ children }) {
  return (
    <div>
      {/* Header arriba */}
      <Header />

      {/* Contenido principal */}
      <main>{children}</main>
    </div>
  );
}
