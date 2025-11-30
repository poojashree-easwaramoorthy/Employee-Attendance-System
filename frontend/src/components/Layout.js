import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { 
  FiHome, 
  FiCalendar, 
  FiClock, 
  FiUsers, 
  FiBarChart2, 
  FiLogOut,
  FiMenu,
  FiX
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

import '../styles/Layout.css';
import '../styles/Sidebar.css';
import '../styles/Header.css';

const Layout = () => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <FiHome />, description: 'Overview and quick actions' },
    { path: '/attendance', label: 'Mark Attendance', icon: <FiClock />, description: 'Check in/out' },
    { path: '/history', label: 'My History', icon: <FiCalendar />, description: 'Attendance records' },
  ];

  const managerNavItems = [
    { path: '/all-attendance', label: 'Team Attendance', icon: <FiUsers />, description: 'Monitor team' },
    { path: '/reports', label: 'Reports', icon: <FiBarChart2 />, description: 'Analytics & insights' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="app-container">
      {/* Sidebar */}
      <motion.div 
        className="sidebar"
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
      >
        <div className="sidebar-header">
          <div className="logo-container">
            <motion.div 
              className="logo"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              AS
            </motion.div>
            <div className="logo-text">
              <div className="logo-title">Attendance Pro</div>
              <div className="logo-subtitle">Smart Management</div>
            </div>
          </div>
        </div>

        <div className="sidebar-content">
          <nav className="nav-links">
            <div className="nav-section">
              <div className="section-label">Main</div>
              {navItems.map(item => (
                <motion.div
                  key={item.path}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    to={item.path}
                    className={`nav-link ${isActive(item.path) ? 'nav-link-active' : ''}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <div className="nav-content">
                      <span className="nav-label">{item.label}</span>
                      <span className="nav-description">{item.description}</span>
                    </div>
                    <div className="nav-indicator"></div>
                  </Link>
                </motion.div>
              ))}
            </div>
            
            {user?.role === 'manager' && (
              <div className="nav-section">
                <div className="section-label">Management</div>
                {managerNavItems.map(item => (
                  <motion.div
                    key={item.path}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Link
                      to={item.path}
                      className={`nav-link ${isActive(item.path) ? 'nav-link-active' : ''}`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="nav-icon">{item.icon}</span>
                      <div className="nav-content">
                        <span className="nav-label">{item.label}</span>
                        <span className="nav-description">{item.description}</span>
                      </div>
                      <div className="nav-indicator"></div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </nav>

          {/* User Profile in Sidebar */}
          <motion.div 
            className="sidebar-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="user-profile">
              <div className="user-avatar">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                <div className="user-name">{user?.name}</div>
                <div className="user-role">{user?.role} • {user?.department}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="main-content">
        <header className="header">
          <div className="header-left">
            <button 
              className="menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <FiX /> : <FiMenu />}
            </button>
            <div className="breadcrumb">
              <span className="page-title">
                {location.pathname === '/dashboard' && 'Dashboard'}
                { location.pathname === '/attendance' && 'Mark Attendance'}
                {location.pathname === '/history' && 'Attendance History'}
                {location.pathname === '/all-attendance' && 'Team Attendance'}
                {location.pathname === '/reports' && 'Reports & Analytics'}
              </span>
            </div>
          </div>
          
          <div className="header-user-info">
            <div className="user-notifications">
              <div className="notification-badge">3</div>
              <FiCalendar className="notification-icon" />
            </div>
            <div className="user-profile-header">
              <div className="user-avatar">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="user-details">
                <div className="user-name">{user?.name}</div>
                <div className="user-role">{user?.role} • {user?.department}</div>
              </div>
            </div>
            <motion.button 
              onClick={handleLogout} 
              className="btn btn-logout"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiLogOut className="btn-icon" /> 
              <span className="logout-text">Logout</span>
            </motion.button>
          </div>
        </header>

        <main className="content-area">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            className="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Layout;