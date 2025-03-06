import Menu from "../../components/menu"; // Asegúrate de la ruta correcta

export default function Layout({ children }) {
  return (

    <div>
      {/* Header arriba */}
      <Menu />

      {/* Contenido principal */}
      <main>{children}</main>
    </div>

  );
}
