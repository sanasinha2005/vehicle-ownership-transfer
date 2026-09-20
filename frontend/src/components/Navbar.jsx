function Navbar({ onDashboardClick }) {
  return (
    <header className="header">
      <div>
        <h1>Vehicle Ownership</h1>
        <p>Hyperledger Fabric Vehicle Registry</p>
      </div>

      <div className="navbar-right">
        <button
          type="button"
          className="nav-button"
          onClick={onDashboardClick}
        >
          Dashboard
        </button>

        <div className="network-status">
          <span className="status-dot"></span>
          Fabric Connected
        </div>
      </div>
    </header>
  );
}

export default Navbar;