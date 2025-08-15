import React, { useState } from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../context/AuthContext';

const NavItem = ({ to, icon, label }) => (
  <LinkContainer to={to}>
    <Nav.Link className="nav-item-custom">
      <i className={`fas ${icon} me-1`} />
      {label}
    </Nav.Link>
  </LinkContainer>
);

const ProductDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <NavDropdown 
      title={<span><i className="fas fa-shopping-bag me-1"></i>สินค้า</span>} 
      id="product-nav-dropdown"
      className="nav-dropdown-custom"
      show={isOpen}
      onToggle={(isOpen) => setIsOpen(isOpen)}
    >
      <LinkContainer to="/products">
        <NavDropdown.Item className="dropdown-item-custom">
          <i className="fas fa-box-open me-1"></i>
          สินค้า
        </NavDropdown.Item>
      </LinkContainer>
      <LinkContainer to="/product-sets">
        <NavDropdown.Item className="dropdown-item-custom">
          <i className="fas fa-layer-group me-1"></i>
          เซ็ทสินค้า
        </NavDropdown.Item>
      </LinkContainer>
    </NavDropdown>
  );
};

const UserMenu = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Nav>
      <NavDropdown
        title={
          <span className="user-menu-title">
            <div className="user-avatar">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
            <div className="user-info">
              <div className="user-name">{user?.firstName} {user?.lastName}</div>
              <div className="user-role">{user?.role || 'พนักงาน'}</div>
            </div>
            <i className="fas fa-chevron-down ms-2"></i>
          </span>
        }
        id="user-nav-dropdown"
        align="end"
        className="user-dropdown-custom"
        show={isOpen}
        onToggle={(isOpen) => setIsOpen(isOpen)}
      >
        <NavDropdown.Header className="user-dropdown-header">
          <div className="user-header-name">{user?.firstName} {user?.lastName}</div>
          <small className="user-header-role">{user?.role || 'พนักงาน'}</small>
        </NavDropdown.Header>
        <NavDropdown.Divider />
        <LinkContainer to="/change-password">
          <NavDropdown.Item className="dropdown-item-custom">
            <i className="fas fa-key me-2"></i>
            เปลี่ยนรหัสผ่าน
          </NavDropdown.Item>
        </LinkContainer>
        <NavDropdown.Divider />
        <NavDropdown.Item onClick={onLogout} className="dropdown-item-custom logout-item">
          <i className="fas fa-sign-out-alt me-2"></i>
          ออกจากระบบ
        </NavDropdown.Item>
      </NavDropdown>
    </Nav>
  );
};

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('คุณต้องการออกจากระบบหรือไม่?')) {
      logout();
    }
  };

  return (
    <>
      <style jsx>{`
        /* Keyframes */
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Main Navbar Styles */
        .navbar-custom {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%) !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1rem 0;
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        /* Brand Styles */
        .navbar-brand-custom {
          display: flex !important;
          align-items: center;
          gap: 12px;
          color: white !important;
          font-size: 1.25rem !important;
          font-weight: 700 !important;
          text-decoration: none !important;
          transition: all 0.3s ease;
          padding: 8px 0;
        }

        .navbar-brand-custom:hover {
          color: white !important;
          transform: translateY(-1px);
        }

        .brand-icon {
          padding: 8px;
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
        }

        .brand-text {
          background: linear-gradient(135deg, #ffffff, #e2e8f0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Navigation Items */
        .nav-item-custom {
          color: #64748b !important;
          font-weight: 500;
          padding: 12px 16px !important;
          margin: 0 4px;
          border-radius: 8px !important;
          transition: all 0.2s ease;
          position: relative;
          text-decoration: none !important;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nav-item-custom:hover {
          color: #475569 !important;
          background: #f1f5f9 !important;
          transform: translateY(-1px);
        }

        .nav-item-custom.active {
          background: linear-gradient(135deg, #3b82f6, #6366f1) !important;
          color: white !important;
          font-weight: 600;
        }

        .nav-item-custom i {
          font-size: 18px;
          transition: all 0.3s ease;
        }

        /* Dropdown Styles */
        .nav-dropdown-custom .dropdown-toggle,
        .user-dropdown-custom .dropdown-toggle {
          color: #64748b !important;
          font-weight: 500;
          padding: 12px 16px !important;
          margin: 0 4px;
          border-radius: 8px;
          transition: all 0.2s ease;
          border: none !important;
          background: none !important;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nav-dropdown-custom .dropdown-toggle:hover,
        .user-dropdown-custom .dropdown-toggle:hover {
          color: #475569 !important;
          background: #f1f5f9 !important;
          transform: translateY(-1px);
        }

        .nav-dropdown-custom .dropdown-toggle::after,
        .user-dropdown-custom .dropdown-toggle::after {
          display: none;
        }

        /* User Menu Specific Styles */
        .user-menu-title {
          display: flex;
          align-items: center;
          gap: 12px;
          color: white !important;
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
          font-weight: bold;
          color: white;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .user-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: white;
        }

        .user-role {
          font-size: 0.75rem;
          color: #cbd5e1;
        }

        .user-dropdown-custom .dropdown-toggle {
          background: rgba(255, 255, 255, 0.1) !important;
          color: white !important;
          border-radius: 12px !important;
          padding: 8px 12px !important;
        }

        .user-dropdown-custom .dropdown-toggle:hover {
          background: rgba(255, 255, 255, 0.2) !important;
          color: white !important;
        }

        /* Dropdown Menu Styles */
        .dropdown-menu {
          background: white !important;
          backdrop-filter: blur(10px);
          border: 1px solid #e2e8f0 !important;
          border-radius: 12px !important;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
          padding: 8px !important;
          margin-top: 8px !important;
          animation: slideDown 0.2s ease-out;
        }

        .dropdown-item-custom {
          color: #374151 !important;
          font-weight: 500;
          padding: 12px 16px !important;
          transition: all 0.2s ease;
          border-radius: 8px !important;
          margin: 2px 0 !important;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .dropdown-item-custom:hover {
          background: #f3f4f6 !important;
          color: #374151 !important;
          transform: translateX(2px);
        }

        .dropdown-item-custom i {
          color: #6b7280;
          transition: all 0.3s ease;
          width: 18px;
        }

        .dropdown-item-custom:hover i {
          color: #3b82f6;
        }

        .logout-item:hover {
          background: #fef2f2 !important;
          color: #dc2626 !important;
        }

        .logout-item:hover i {
          color: #dc2626 !important;
        }

        /* User Dropdown Header */
        .user-dropdown-header {
          padding: 12px 16px !important;
          border-bottom: 1px solid #f1f5f9 !important;
          margin-bottom: 8px !important;
        }

        .user-header-name {
          font-weight: 600 !important;
          color: #374151 !important;
          margin-bottom: 4px;
        }

        .user-header-role {
          color: #6b7280 !important;
          font-size: 0.875rem !important;
        }

        .dropdown-divider {
          margin: 8px 0 !important;
          border-color: #f1f5f9 !important;
        }

        /* Search and Notification Buttons */
        .action-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          border: none;
          background: rgba(255, 255, 255, 0.1);
          color: #cbd5e1;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }

        .action-button:hover {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .notification-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          width: 8px;
          height: 8px;
          background: #ef4444;
          border-radius: 50%;
          border: 2px solid white;
        }

        /* Responsive */
        @media (max-width: 991px) {
          .navbar-nav {
            background: rgba(255,255,255,0.1);
            border-radius: 12px;
            padding: 1rem;
            margin-top: 1rem;
          }

          .user-info {
            display: none;
          }

          .user-menu-title {
            gap: 8px;
          }
        }

        @media (max-width: 576px) {
          .brand-text {
            font-size: 1rem !important;
          }
        }
      `}</style>

      <BootstrapNavbar className="navbar-custom" variant="dark" expand="lg" sticky="top">
        <Container>
          <LinkContainer to="/dashboard">
            <BootstrapNavbar.Brand className="navbar-brand-custom">
              <div className="brand-icon">
                <i className="fas fa-warehouse"></i>
              </div>
              <span className="brand-text">ระบบคลังสินค้า WTR</span>
            </BootstrapNavbar.Brand>
          </LinkContainer>

          {/* Search and Notifications */}
          <div className="d-flex align-items-center gap-3 order-lg-last">
            <button className="action-button d-none d-md-flex">
              <i className="fas fa-search"></i>
            </button>

            <button className="action-button d-none d-md-flex">
              <i className="fas fa-bell"></i>
              <div className="notification-badge"></div>
            </button>

            <UserMenu user={user} onLogout={handleLogout} />
          </div>

          <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
          <BootstrapNavbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <NavItem to="/dashboard" icon="fa-tachometer-alt" label="แดชบอร์ด" />
              <NavItem to="/employees" icon="fa-users" label="พนักงาน" />
              <NavItem to="/customers" icon="fa-user-friends" label="ลูกค้า" />
              <NavItem to="/stocks" icon="fa-boxes" label="วัสดุ" />
              <ProductDropdown />
              <NavItem to="/bills" icon="fa-file-invoice" label="บิล" />
            </Nav>
          </BootstrapNavbar.Collapse>
        </Container>
      </BootstrapNavbar>
    </>
  );
};

export default Navbar;