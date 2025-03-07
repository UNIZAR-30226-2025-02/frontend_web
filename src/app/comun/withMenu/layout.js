import Menu from "../../components/menu"; // Asegúrate de la ruta correcta
import Footer from "../../components/footer"; // Importamos el Footer

export default function Layout({ children }) {
  return (

    <div>
      {/* Header arriba */}
      <Menu />

      {/* Contenido principal */}
      <main>{children}</main>

      {/* Footer abajo */}
      <Footer />
    </div>

  );
}
