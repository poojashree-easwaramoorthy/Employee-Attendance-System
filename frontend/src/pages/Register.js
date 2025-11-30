import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, clearError } from '../store/slices/authSlice';
import { FiUser, FiMail, FiLock, FiBriefcase, FiUserPlus, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';
import { motion } from 'framer-motion';

// Import your image - adjust the path according to your project structure
import registerImage from '../images/Register.jpg';
import '../styles/Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    employeeId: '',
    department: '',
    role: 'employee'
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector(state => state.auth);

  const departments = [
    { value: 'engineering', label: 'Engineering' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'finance', label: 'Finance' },
    { value: 'operations', label: 'Operations' },
    { value: 'it-support', label: 'IT Support' }
  ];

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email address is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.employeeId.trim()) {
      errors.employeeId = 'Employee ID is required';
    }
    
    if (!formData.department) {
      errors.department = 'Department is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    if (error) dispatch(clearError());
  };

  // Handle blur events for validation
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  // Handle role selection
  const handleRoleChange = (role) => {
    setFormData(prev => ({
      ...prev,
      role
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({
      name: true,
      email: true,
      password: true,
      employeeId: true,
      department: true
    });
    
    if (validateForm()) {
      dispatch(register(formData))
        .unwrap()
        .then(() => {
          // Success handled by useEffect below
        })
        .catch(err => console.error('Registration failed:', err));
    }
  };

  // Redirect on success
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  // Password strength indicator component
  const PasswordStrength = ({ password }) => {
    const getStrength = (pass) => {
      if (pass.length === 0) return 0;
      if (pass.length < 6) return 1;
      if (pass.length < 8) return 2;
      if (/[A-Z]/.test(pass) && /[0-9]/.test(pass) && /[!@#$%^&*]/.test(pass)) return 4;
      if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) return 3;
      return 2;
    };

    const strength = getStrength(password);
    const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    const strengthColors = ['', '#ef4444', '#f59e0b', '#10b981', '#059669'];

    return (
      <div className="password-strength">
        <div className="strength-bars">
          {[1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`strength-bar ${strength >= level ? 'active' : ''}`}
              style={{ 
                backgroundColor: strength >= level ? strengthColors[strength] : '#e5e7eb' 
              }}
            />
          ))}
        </div>
        <span className="strength-label" style={{ color: strengthColors[strength] }}>
          {strengthLabels[strength]}
        </span>
      </div>
    );
  };

  return (
    <div className="register-container">
      <div className="register-background">
        <div className="floating-team">
          <div className="team-avatar a1">👨‍💻</div>
          <div className="team-avatar a2">👩‍🎨</div>
          <div className="team-avatar a3">👨‍💼</div>
          <div className="team-avatar a4">👩‍🔬</div>
        </div>
        <div className="background-pattern"></div>
      </div>

      <div className="register-layout">
        {/* Left Side - Graphic Section */}
        <motion.div 
          className="register-graphic"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="register-image-container">
            <img 
              src={registerImage} 
              alt="Join Our Team" 
              className="register-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            {/* Fallback SVG if image fails to load */}
            <svg 
              width="100%" 
              height="100%" 
              viewBox="0 0 400 250" 
              fill="none" 
              style={{ display: 'none' }}
            >
              <rect width="400" height="250" fill="#4f46e5" rx="10"/>
              <circle cx="200" cy="100" r="30" fill="white" fillOpacity="0.2"/>
              <path d="M185 100 L200 115 L225 85" stroke="white" strokeWidth="3" strokeLinecap="round"/>
              <text x="200" y="160" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
                Join Our Team
              </text>
              <text x="200" y="185" textAnchor="middle" fill="white" fontSize="12" opacity="0.8">
                Start Your Journey
              </text>
            </svg>
          </div>
          
          <div className="graphic-content">
            <h2>Join Our Team</h2>
            <p>Become part of our organization and track attendance efficiently</p>
            
            <div className="benefits-list">
              <div className="benefit-item">
                <FiUser className="benefit-icon" />
                <span>Easy Check-ins</span>
              </div>
              <div className="benefit-item">
                <FiBriefcase className="benefit-icon" />
                <span>Track Progress</span>
              </div>
              <div className="benefit-item">
                <FiUserPlus className="benefit-icon" />
                <span>Team Collaboration</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Register Form */}
        <motion.div 
          className="register-card"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="register-logo">
            <motion.div 
              className="logo"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span>AS</span>
              <div className="logo-glow"></div>
            </motion.div>
            <h1>Join Attendance Pro</h1>
            <p className="register-subtitle">Create your account</p>
          </div>

          {/* Success Message */}
          {success && (
            <motion.div 
              className="success-message"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <FiCheck className="success-icon" />
              Registration successful! Redirecting to dashboard...
            </motion.div>
          )}

          {/* Error Message */}
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
          
          <form onSubmit={handleSubmit} className="register-form">
            {/* Full Name Field */}
            <motion.div 
              className="form-group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label htmlFor="name" className="form-label">
                <FiUser className="label-icon" />
                Full Name
              </label>
              <div className="form-input-with-icon">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`form-input ${formErrors.name && touched.name ? 'error' : ''}`}
                  placeholder="Enter your full name"
                />
                <div className="input-decoration"></div>
              </div>
              {formErrors.name && touched.name && (
                <motion.span 
                  className="field-error"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {formErrors.name}
                </motion.span>
              )}
            </motion.div>

            {/* Email Field */}
            <motion.div 
              className="form-group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
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
                  onBlur={handleBlur}
                  required
                  className={`form-input ${formErrors.email && touched.email ? 'error' : ''}`}
                  placeholder="Enter your email"
                />
                <div className="input-decoration"></div>
              </div>
              {formErrors.email && touched.email && (
                <motion.span 
                  className="field-error"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {formErrors.email}
                </motion.span>
              )}
            </motion.div>

            {/* Employee ID and Department Row */}
            <div className="form-row">
              <motion.div 
                className="form-group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label htmlFor="employeeId" className="form-label">
                  <FiUser className="label-icon" />
                  Employee ID
                </label>
                <div className="form-input-with-icon">
                  <input
                    type="text"
                    id="employeeId"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={`form-input ${formErrors.employeeId && touched.employeeId ? 'error' : ''}`}
                    placeholder="EMP001"
                  />
                  <div className="input-decoration"></div>
                </div>
                {formErrors.employeeId && touched.employeeId && (
                  <motion.span 
                    className="field-error"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {formErrors.employeeId}
                  </motion.span>
                )}
              </motion.div>

              <motion.div 
                className="form-group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                <label htmlFor="department" className="form-label">
                  <FiBriefcase className="label-icon" />
                  Department
                </label>
                <div className="form-input-with-icon">
                  <select 
                    id="department"
                    name="department" 
                    value={formData.department} 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`form-input form-select ${formErrors.department && touched.department ? 'error' : ''}`}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept.value} value={dept.value}>
                        {dept.label}
                      </option>
                    ))}
                  </select>
                  <div className="input-decoration"></div>
                </div>
                {formErrors.department && touched.department && (
                  <motion.span 
                    className="field-error"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {formErrors.department}
                  </motion.span>
                )}
              </motion.div>
            </div>
            
            {/* Password Field */}
            <motion.div 
              className="form-group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
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
                  onBlur={handleBlur}
                  required
                  className={`form-input ${formErrors.password && touched.password ? 'error' : ''}`}
                  placeholder="Enter your password"
                  minLength="6"
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
              {formData.password && <PasswordStrength password={formData.password} />}
              {formErrors.password && touched.password && (
                <motion.span 
                  className="field-error"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {formErrors.password}
                </motion.span>
              )}
            </motion.div>

            {/* Role Selection */}
            <motion.div 
              className="form-group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              <label className="form-label">
                <FiUser className="label-icon" />
                Role
              </label>
              <div className="role-selection">
                {[
                  { value: 'employee', label: 'Employee', icon: <FiUser /> },
                  { value: 'manager', label: 'Manager', icon: <FiBriefcase /> }
                ].map(role => (
                  <label key={role.value} className="role-option">
                    <input
                      type="radio"
                      name="role"
                      value={role.value}
                      checked={formData.role === role.value}
                      onChange={() => handleRoleChange(role.value)}
                    />
                    <div className="role-card">
                      <div className="role-icon">
                        {role.icon}
                      </div>
                      <div className="role-info">
                        <div className="role-title">
                          {role.label}
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </motion.div>
            
            {/* Register Button */}
            <motion.button 
              type="submit" 
              disabled={loading || success} 
              className="register-btn"
              whileHover={{ scale: (loading || success) ? 1 : 1.02 }}
              whileTap={{ scale: (loading || success) ? 1 : 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {loading ? (
                <>
                  <div className="loading-spinner-small"></div>
                  Creating Account...
                </>
              ) : success ? (
                <>
                  <FiCheck className="btn-icon" />
                  Registration Successful!
                </>
              ) : (
                <>
                  <FiUserPlus className="btn-icon" />
                  Create Account
                </>
              )}
            </motion.button>
          </form>
          
          {/* Footer Links */}
          <motion.div 
            className="register-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <p className="auth-link">
              Already have an account?{' '}
              <Link to="/login" className="auth-link-text">
                Sign in here
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;