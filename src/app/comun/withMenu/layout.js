import Menu from "../../components/menu"; // Importamos el Menu
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
