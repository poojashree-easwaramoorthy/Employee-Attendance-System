import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, clearError } from '../store/slices/authSlice';
import { FiMail, FiLock, FiLogIn, FiEye, FiEyeOff, FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';

// Import your image - adjust the path according to your project structure
import attendanceImage from '../images/images.jpeg'; // or .png, .svg, etc.
import '../styles/Login.css';
// Create a simple SVG graphic
const AttendanceGraphic = () => (
  <div className="attendance-graphic">
    <svg width="400" height="250" viewBox="0 0 400 250" fill="none">
      <rect width="400" height="250" fill="#4f46e5" rx="10"/>
      <circle cx="200" cy="125" r="40" fill="white" fillOpacity="0.2"/>
      <path d="M180 125 L195 140 L220 110" stroke="white" strokeWidth="3" strokeLinecap="round"/>
      <text x="200" y="180" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">
        Attendance Pro
      </text>
    </svg>
  </div>
);

// Then use it like this:
<AttendanceGraphic />

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) dispatch(clearError());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData))
      .unwrap()
      .then(() => navigate('/dashboard'))
      .catch(err => console.error('Login failed:', err));
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="floating-employees">
          <div className="employee-avatar e1">👨‍💼</div>
          <div className="employee-avatar e2">👩‍💻</div>
          <div className="employee-avatar e3">👨‍🔧</div>
          <div className="employee-avatar e4">👩‍🎓</div>
        </div>
        <div className="background-pattern"></div>
      </div>

      <div className="auth-layout">
        <motion.div 
          className="auth-graphic"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Replace ImagePlaceholder with actual image */}
          <div className="auth-image-container">
            <img 
              src={attendanceImage} 
              alt="Attendance Pro Dashboard" 
              className="auth-image"
            />
          </div>
          <div className="graphic-content">
            <h2>Welcome to Attendance Pro</h2>
            <p>Streamline your team's attendance tracking with our smart management system</p>
            <div className="feature-list">
              <div className="feature-item">
                <FiUser className="feature-icon" />
                <span>Employee Self-Service</span>
              </div>
              <div className="feature-item">
                <FiLogIn className="feature-icon" />
                <span>Real-time Tracking</span>
              </div>
              <div className="feature-item">
                <FiLock className="feature-icon" />
                <span>Secure & Reliable</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="auth-card"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="auth-logo">
            <motion.div 
              className="logo"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span>AS</span>
              <div className="logo-glow"></div>
            </motion.div>
            <h1>Attendance Pro</h1>
            <p className="auth-subtitle">Sign in to your account</p>
          </div>

          {error && (
            <motion.div 
              className="error-message"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="error-icon">⚠️</div>
              {error}
            </motion.div>
          )}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <motion.div 
              className="form-group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label htmlFor="email" className="form-label">
                <FiMail className="label-icon" />
                Email Address
              </label>
              <div className="form-input-with-icon">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Enter your email"
                />
                <div className="input-decoration"></div>
              </div>
            </motion.div>
            
            <motion.div 
              className="form-group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label htmlFor="password" className="form-label">
                <FiLock className="label-icon" />
                Password
              </label>
              <div className="form-input-with-icon">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
                <div className="input-decoration"></div>
              </div>
            </motion.div>
            
            <motion.button 
              type="submit" 
              disabled={loading} 
              className="btn btn-primary auth-btn"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {loading ? (
                <div className="loading-spinner-small"></div>
              ) : (
                <FiLogIn className="btn-icon" />
              )}
              {loading ? 'Signing In...' : 'Sign In to Dashboard'}
            </motion.button>
          </form>
          
          <motion.div 
            className="auth-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="auth-link">
              Don't have an account?{' '}
              <Link to="/register" className="auth-link-text">
                Create an account
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;