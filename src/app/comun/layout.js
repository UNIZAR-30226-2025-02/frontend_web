import Header from "../components/header"; // Asegúrate de la ruta correcta
import ForceLogoutScreen from "../components/ForceLogoutScreen"; // Asegúrate de la ruta correcta
import FriendRequest from "../components/FriendRequest"; // Asegúrate de la ruta correcta
import FriendRequestMatch from "../components/FriendRequestMatch"; // Asegúrate de la ruta correcta
import GoGamePage from "../components/goGamePage"; // Asegúrate de la ruta correcta

export default function Layout({ children }) {
  return (
    <div>
      {/* Header arriba */}
      <Header />
      <ForceLogoutScreen /> 
      <FriendRequestMatch /> 
      <FriendRequest />     
      <GoGamePage />  

      {/* Contenido principal */}
      <main>
        {children}</main>
    </div>
  );
}
