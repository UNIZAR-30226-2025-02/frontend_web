import Header from "../components/header"; 
import ForceLogoutScreen from "../components/ForceLogoutScreen"; 
import FriendRequest from "../components/FriendRequest"; 
import FriendRequestMatch from "../components/FriendRequestMatch"; 
import GoGamePage from "../components/goGamePage"; 

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
