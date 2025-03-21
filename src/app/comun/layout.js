import Header from "../components/header"; // Asegúrate de la ruta correcta
import ForceLogoutScreen from "../components/ForceLogoutScreen"; // Asegúrate de la ruta correcta


export default function Layout({ children }) {
  return (
    <div>
      {/* Header arriba */}
      <Header />
      <ForceLogoutScreen />      
      {/* Contenido principal */}
      <main>
        {children}</main>
    </div>
  );
}
