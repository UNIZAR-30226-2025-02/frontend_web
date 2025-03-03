export default function Layout({ children }) {
    return (
      <div>
        <header style={{ padding: "10px", background: "#333", color: "white" }}>
          <h1>Mi Sitio de Ajedrez</h1>
        </header>
  
        <main style={{ padding: "20px" }}>{children}</main>
  
        <footer style={{ padding: "10px", background: "#333", color: "white", marginTop: "20px" }}>
          <p>&copy; 2024 Mi Proyecto</p>
        </footer>
      </div>
    );
  }
  