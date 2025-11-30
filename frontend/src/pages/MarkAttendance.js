import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTodayStatus, checkIn, checkOut } from '../store/slices/attendanceSlice';
import { FiClock, FiCheckCircle, FiLogOut, FiMapPin, FiWifi, FiCalendar } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

import '../styles/MarkAttendance.css';

const MarkAttendance = () => {
  const { todayStatus, loading } = useSelector(state => state.attendance);
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState('Office HQ');
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    dispatch(getTodayStatus());
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Simulate location detection
    setLocation(Math.random() > 0.5 ? 'Office HQ' : 'Remote');

    return () => clearInterval(timer);
  }, [dispatch]);

  const handleCheckIn = () => {
    setShowConfirmation(true);
    setTimeout(() => {
      dispatch(checkIn());
      setShowConfirmation(false);
    }, 1500);
  };

  const handleCheckOut = () => {
    setShowConfirmation(true);
    setTimeout(() => {
      dispatch(checkOut());
      setShowConfirmation(false);
    }, 1500);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const officeHours = [
    { time: '9:00 AM', label: 'Office Opens', type: 'start' },
    { time: '1:00 PM', label: 'Lunch Break', type: 'break' },
    { time: '2:00 PM', label: 'Back to Work', type: 'resume' },
    { time: '6:00 PM', label: 'Office Closes', type: 'end' }
  ];

  return (
    <div className="mark-attendance">
      <div className="attendance-container">
        {/* Header Section */}
        <motion.div 
          className="attendance-header"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="user-welcome">
            <div className="user-avatar-large">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="welcome-text">
              <h1>{getGreeting()}, {user?.name}! 🌟</h1>
              <p>Ready to record your attendance for today</p>
            </div>
          </div>
          <div className="location-info">
            <div className="location-badge">
              <FiMapPin className="location-icon" />
              {location}
            </div>
            <div className="connection-badge">
              <FiWifi className="connection-icon" />
              Secure Connection
            </div>
          </div>
        </motion.div>

        <div className="attendance-content">
          {/* Left Column - Main Action */}
          <div className="action-column">
            <motion.div 
              className="attendance-card main-action"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="card-header">
                <h2 className="card-title">
                  <FiClock className="card-icon" />
                  Mark Your Attendance
                </h2>
                <div className="current-date">
                  <FiCalendar className="date-icon" />
                  {currentTime.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>

              <div className="time-display-section">
                <div className="live-time">
                  {formatTime(currentTime)}
                </div>
                <div className="time-label">Current Time</div>
              </div>

              <div className="attendance-status">
                <motion.div 
                  className={`status-indicator ${todayStatus?.status || 'pending'}`}
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
                      {todayStatus?.status ? todayStatus.status.toUpperCase() : 'AWAITING CHECK-IN'}
                    </div>
                    <div className="status-subtext">
                      {todayStatus?.checkOutTime 
                        ? 'Completed for today' 
                        : todayStatus?.checkInTime 
                        ? 'Checked in, ready for check-out'
                        : 'Ready to check in'
                      }
                    </div>
                  </div>
                </motion.div>
              </div>

              <AnimatePresence>
                {showConfirmation && (
                  <motion.div 
                    className="confirmation-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="confirmation-content">
                      <div className="confirmation-spinner"></div>
                      <p>Processing your attendance...</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="action-buttons">
                {!todayStatus?.checkInTime && (
                  <motion.button 
                    onClick={handleCheckIn} 
                    disabled={loading || showConfirmation}
                    className="btn btn-primary checkin-btn"
                    whileHover={{ scale: loading ? 1 : 1.05 }}
                    whileTap={{ scale: loading ? 1 : 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <FiClock className="btn-icon" /> 
                    {loading || showConfirmation ? 'Processing...' : 'Check In Now'}
                    <div className="btn-shine"></div>
                  </motion.button>
                )}
                
                {todayStatus?.checkInTime && !todayStatus?.checkOutTime && (
                  <motion.button 
                    onClick={handleCheckOut} 
                    disabled={loading || showConfirmation}
                    className="btn btn-warning checkout-btn"
                    whileHover={{ scale: loading ? 1 : 1.05 }}
                    whileTap={{ scale: loading ? 1 : 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <FiLogOut className="btn-icon" /> 
                    {loading || showConfirmation ? 'Processing...' : 'Check Out Now'}
                    <div className="btn-shine"></div>
                  </motion.button>
                )}
                
                {todayStatus?.checkOutTime && (
                  <motion.div 
                    className="completed-section"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="success-animation">
                      <FiCheckCircle className="success-icon" />
                    </div>
                    <div className="completion-message">
                      <h3>Great work today! 🎉</h3>
                      <p>You've successfully completed your attendance for today</p>
                      <div className="work-summary">
                        <div className="summary-item">
                          <span className="summary-label">Total Hours:</span>
                          <span className="summary-value">{todayStatus.totalHours}h</span>
                        </div>
                        <div className="summary-item">
                          <span className="summary-label">Status:</span>
                          <span className="summary-value status-badge">{todayStatus.status}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Attendance Details */}
            {(todayStatus?.checkInTime || todayStatus?.checkOutTime) && (
              <motion.div 
                className="attendance-card details-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h3 className="card-title">Attendance Details</h3>
                <div className="details-grid">
                  {todayStatus?.checkInTime && (
                    <div className="detail-item">
                      <div className="detail-icon">🟢</div>
                      <div className="detail-content">
                        <div className="detail-label">Checked In</div>
                        <div className="detail-value">
                          {new Date(todayStatus.checkInTime).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                  {todayStatus?.checkOutTime && (
                    <div className="detail-item">
                      <div className="detail-icon">🔴</div>
                      <div className="detail-content">
                        <div className="detail-label">Checked Out</div>
                        <div className="detail-value">
                          {new Date(todayStatus.checkOutTime).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                  {todayStatus?.totalHours > 0 && (
                    <div className="detail-item">
                      <div className="detail-icon">⏱️</div>
                      <div className="detail-content">
                        <div className="detail-label">Total Hours</div>
                        <div className="detail-value">{todayStatus.totalHours}h</div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - Info & Schedule */}
          <div className="info-column">
            {/* Office Hours */}
            <motion.div 
              className="attendance-card schedule-card"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="card-title">Office Schedule</h3>
              <div className="schedule-timeline">
                {officeHours.map((slot, index) => (
                  <motion.div
                    key={slot.time}
                    className={`schedule-slot ${slot.type}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <div className="slot-time">{slot.time}</div>
                    <div className="slot-label">{slot.label}</div>
                    <div className="slot-marker"></div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div 
              className="attendance-card stats-card"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="card-title">This Week</h3>
              <div className="week-stats">
                <div className="stat-item">
                  <div className="stat-value">4</div>
                  <div className="stat-label">Days Present</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">0</div>
                  <div className="stat-label">Days Late</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">32.5</div>
                  <div className="stat-label">Total Hours</div>
                </div>
              </div>
            </motion.div>

            {/* Team Activity */}
            <motion.div 
              className="attendance-card team-card"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h3 className="card-title">Team Activity</h3>
              <div className="team-activity">
                <div className="activity-item online">
                  <div className="activity-avatar">👨‍💼</div>
                  <div className="activity-info">
                    <div className="activity-name">You</div>
                    <div className="activity-status">Checked In</div>
                  </div>
                  <div className="activity-time">Just now</div>
                </div>
                <div className="activity-item online">
                  <div className="activity-avatar">👩‍💻</div>
                  <div className="activity-info">
                    <div className="activity-name">Sarah Chen</div>
                    <div className="activity-status">Working</div>
                  </div>
                  <div className="activity-time">2 min ago</div>
                </div>
                <div className="activity-item away">
                  <div className="activity-avatar">👨‍🔧</div>
                  <div className="activity-info">
                    <div className="activity-name">Mike Ross</div>
                    <div className="activity-status">In Meeting</div>
                  </div>
                  <div className="activity-time">15 min ago</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkAttendance;