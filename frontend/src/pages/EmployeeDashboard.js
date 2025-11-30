import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTodayStatus, checkIn, checkOut, getMySummary } from '../store/slices/attendanceSlice';
import { FiClock, FiCalendar, FiUserCheck, FiTrendingUp, FiArrowRight, FiCheckCircle, FiUsers } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ImagePlaceholder from '../components/ImagePlaceholder';

import '../styles/EmployeeDashboard.css';

const EmployeeDashboard = () => {
  const { user } = useSelector(state => state.auth);
  const { todayStatus, mySummary, loading } = useSelector(state => state.attendance);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTodayStatus());
    dispatch(getMySummary());
  }, [dispatch]);

  // Helper functions
  const getStatusVariant = (status) => {
    const variants = {
      'checked-in': 'present',
      'checked-out': 'checked-out',
      'present': 'present',
      'absent': 'pending',
      'late': 'pending',
      'pending': 'pending'
    };
    return variants[status] || 'pending';
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getStatusDisplayText = (status) => {
    const statusMap = {
      'checked-in': 'CHECKED IN',
      'checked-out': 'CHECKED OUT',
      'present': 'PRESENT',
      'absent': 'ABSENT',
      'late': 'LATE',
      'pending': 'NOT CHECKED IN'
    };
    return statusMap[status] || 'NOT CHECKED IN';
  };

  const handleCheckIn = () => {
    dispatch(checkIn());
  };

  const handleCheckOut = () => {
    dispatch(checkOut());
  };

  const teamMembers = [
    { name: 'You', role: user?.role, avatar: '👨‍💼', status: 'active' },
    { name: 'Sarah Chen', role: 'Designer', avatar: '👩‍🎨', status: 'present' },
    { name: 'Mike Ross', role: 'Developer', avatar: '👨‍💻', status: 'present' },
    { name: 'Emma Davis', role: 'Manager', avatar: '👩‍💼', status: 'meeting' },
    { name: 'Alex Kim', role: 'Intern', avatar: '👨‍🎓', status: 'remote' }
  ];

  const stats = [
    {
      icon: <FiUserCheck />,
      value: mySummary?.present || 0,
      label: 'Present Days',
      color: 'stat-present',
      delay: 0.1,
      trend: '+2%'
    },
    {
      icon: <FiCalendar />,
      value: mySummary?.absent || 0,
      label: 'Absent Days',
      color: 'stat-absent',
      delay: 0.2,
      trend: '-1%'
    },
    {
      icon: <FiClock />,
      value: mySummary?.late || 0,
      label: 'Late Days',
      color: 'stat-late',
      delay: 0.3,
      trend: '0%'
    },
    {
      icon: <FiTrendingUp />,
      value: mySummary?.totalHours?.toFixed(1) || 0,
      label: 'Total Hours',
      color: 'stat-hours',
      delay: 0.4,
      trend: '+5%'
    }
  ];

  return (
    <div className="employee-dashboard">
      {/* Welcome Section */}
      <motion.div 
        className="welcome-section"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="welcome-content">
          <div className="user-greeting">
            <div className="user-avatar-large">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="welcome-title">{getGreeting()}, {user?.name}! 👋</h1>
              <p className="welcome-subtitle">Here's your attendance overview for today</p>
            </div>
          </div>
          <div className="user-badges">
            <span className="user-badge">{user?.employeeId}</span>
            <span className="user-badge">{user?.department}</span>
            <span className="user-badge role-badge">{user?.role}</span>
          </div>
        </div>
        <div className="welcome-graphic">
          <ImagePlaceholder type="dashboard" className="dashboard-image" />
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className={`stat-card ${stat.color}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: stat.delay }}
            whileHover={{ 
              scale: 1.05,
              y: -5
            }}
          >
            <div className="stat-icon">
              {stat.icon}
            </div>
            <div className="stat-content">
              <div className="stat-main">
                <div className="stat-number">{stat.value}</div>
                <span className="stat-trend">{stat.trend}</span>
              </div>
              <div className="stat-label">{stat.label}</div>
            </div>
            <div className="stat-glow"></div>
          </motion.div>
        ))}
      </div>

      <div className="dashboard-content">
        {/* Left Column */}
        <div className="content-left">
          {/* Today's Attendance */}
          <motion.div 
            className="dashboard-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="card-header">
              <h2 className="card-title">
                <FiClock className="card-icon" />
                Today's Attendance
              </h2>
              <div className="current-date">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
            <div className="today-attendance">
              <motion.div 
                className={`status-badge-large ${getStatusVariant(todayStatus?.status)}`}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <div className="status-content">
                  <div className="status-icon">
                    {todayStatus?.checkOutTime ? (
                      <FiCheckCircle />
                    ) : todayStatus?.checkInTime ? (
                      <FiClock />
                    ) : (
                      <FiClock />
                    )}
                  </div>
                  <div className="status-text">
                    {getStatusDisplayText(todayStatus?.status)}
                  </div>
                </div>
              </motion.div>
              
              <div className="attendance-details">
                {todayStatus?.checkInTime && (
                  <motion.div 
                    className="detail-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <span className="detail-label">Check In</span>
                    <span className="detail-value">
                      {new Date(todayStatus.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </motion.div>
                )}
                {todayStatus?.checkOutTime && (
                  <motion.div 
                    className="detail-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <span className="detail-label">Check Out</span>
                    <span className="detail-value">
                      {new Date(todayStatus.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </motion.div>
                )}
                {todayStatus?.totalHours > 0 && (
                  <motion.div 
                    className="detail-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <span className="detail-label">Total Hours</span>
                    <span className="detail-value">{todayStatus.totalHours}h</span>
                  </motion.div>
                )}
              </div>

              <div className="action-buttons">
                {!todayStatus?.checkInTime && (
                  <motion.button 
                    onClick={handleCheckIn} 
                    disabled={loading}
                    className="btn btn-primary checkin-btn"
                    whileHover={{ scale: loading ? 1 : 1.05 }}
                    whileTap={{ scale: loading ? 1 : 0.95 }}
                  >
                    <FiClock className="btn-icon" /> 
                    {loading ? 'Processing...' : 'Check In Now'}
                    <div className="btn-shine"></div>
                  </motion.button>
                )}
                
                {todayStatus?.checkInTime && !todayStatus?.checkOutTime && (
                  <motion.button 
                    onClick={handleCheckOut} 
                    disabled={loading}
                    className="btn btn-warning checkout-btn"
                    whileHover={{ scale: loading ? 1 : 1.05 }}
                    whileTap={{ scale: loading ? 1 : 0.95 }}
                  >
                    <FiClock className="btn-icon" /> 
                    {loading ? 'Processing...' : 'Check Out Now'}
                    <div className="btn-shine"></div>
                  </motion.button>
                )}
                
                {todayStatus?.checkOutTime && (
                  <motion.div 
                    className="completed-message"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="success-icon">🎉</div>
                    <div className="message-content">
                      <p className="message-title">Great work today!</p>
                      <p className="message-detail">You've completed {todayStatus.totalHours}h of work</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Team Activity */}
          <motion.div 
            className="dashboard-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="card-header">
              <h2 className="card-title">
                <FiUsers className="card-icon" />
                Team Activity
              </h2>
              <span className="online-count">4 online</span>
            </div>
            <div className="team-grid">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  className="team-member"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <div className="member-avatar">
                    {member.avatar}
                    <div className={`status-dot ${member.status}`}></div>
                  </div>
                  <div className="member-info">
                    <div className="member-name">{member.name}</div>
                    <div className="member-role">{member.role}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="content-right">
          {/* Quick Actions */}
          <motion.div 
            className="dashboard-card quick-actions-card"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="card-header">
              <h2 className="card-title">Quick Actions</h2>
            </div>
            <div className="quick-actions-grid">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/history" className="action-card">
                  <div className="action-icon">
                    <FiCalendar />
                  </div>
                  <div className="action-content">
                    <h3 className="action-title">View History</h3>
                    <p className="action-description">Check your attendance records and trends</p>
                  </div>
                  <FiArrowRight className="action-arrow" />
                  <div className="action-glow"></div>
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/attendance" className="action-card">
                  <div className="action-icon">
                    <FiTrendingUp />
                  </div>
                  <div className="action-content">
                    <h3 className="action-title">Mark Attendance</h3>
                    <p className="action-description">Record your daily check-in and check-out</p>
                  </div>
                  <FiArrowRight className="action-arrow" />
                  <div className="action-glow"></div>
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/reports" className="action-card">
                  <div className="action-icon">
                    <FiUserCheck />
                  </div>
                  <div className="action-content">
                    <h3 className="action-title">My Reports</h3>
                    <p className="action-description">Generate personal attendance reports</p>
                  </div>
                  <FiArrowRight className="action-arrow" />
                  <div className="action-glow"></div>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Office Hours */}
          <motion.div 
            className="dashboard-card office-hours-card"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="card-header">
              <h2 className="card-title">Office Hours</h2>
            </div>
            <div className="office-hours">
              <div className="time-slot">
                <span className="time-label">Check-in Time</span>
                <span className="time-value">9:00 AM</span>
              </div>
              <div className="time-slot">
                <span className="time-label">Lunch Break</span>
                <span className="time-value">1:00 - 2:00 PM</span>
              </div>
              <div className="time-slot">
                <span className="time-label">Check-out Time</span>
                <span className="time-value">6:00 PM</span>
              </div>
              <div className="time-slot highlight">
                <span className="time-label">Flexible Hours</span>
                <span className="time-value">Available</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;