import '../globals.css'
import './layout.css'
export default function Layout({ children }) {
    return (
      <div className="container">
      <div className="logoContainer">
        <h1 className="logoText">
         <img src="/logoNombre.png" alt="Logo" className="logoImage" />
        </h1>
      </div>
      <div className="formContainer">{children}</div>
    </div>
    );
  }
  