import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllAttendance } from '../store/slices/attendanceSlice';
import { FiUsers, FiUserCheck, FiUserX, FiClock, FiBarChart2, FiArrowRight, FiTrendingUp } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ImagePlaceholder from '../components/ImagePlaceholder';

import '../styles/ManagerDashboard.css';

const ManagerDashboard = () => {
  const { user } = useSelector(state => state.auth);
  const { allAttendance } = useSelector(state => state.attendance);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllAttendance());
  }, [dispatch]);

  // Helper functions
  const getAttendanceTrend = (current, previous) => {
    if (previous === 0) return '+0%';
    const change = ((current - previous) / previous) * 100;
    return `${change >= 0 ? '+' : ''}${Math.round(change)}%`;
  };

  const getStatusColor = (status) => {
    const colors = {
      present: '#10b981',
      absent: '#ef4444',
      late: '#f59e0b',
      'half-day': '#3b82f6'
    };
    return colors[status] || '#6b7280';
  };

  // Department stats
  const departmentStats = [
    { 
      name: 'Engineering', 
      present: 12, 
      total: 15, 
      trend: '+5%'
    },
    { 
      name: 'Design', 
      present: 8, 
      total: 10, 
      trend: '+2%'
    },
    { 
      name: 'Marketing', 
      present: 6, 
      total: 8, 
      trend: '-1%'
    },
    { 
      name: 'Sales', 
      present: 10, 
      total: 12, 
      trend: '+3%'
    }
  ];

  // Calculate stats
  const today = new Date().toDateString();
  const todayAttendance = allAttendance.filter(record => 
    new Date(record.date).toDateString() === today
  );

  const presentToday = todayAttendance.filter(record => 
    ['present', 'late', 'half-day'].includes(record.status)
  ).length;

  const lateToday = todayAttendance.filter(record => record.status === 'late').length;
  const totalEmployees = 25;
  const attendancePercentage = Math.round((presentToday / totalEmployees) * 100);

  return (
    <div className="manager-dashboard">
      {/* Header */}
      <motion.div 
        className="dashboard-header"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="header-content">
          <div className="manager-info">
            <div className="manager-avatar">
              {user?.name?.charAt(0).toUpperCase() || 'M'}
            </div>
            <div>
              <h1 className="dashboard-title">Manager Dashboard</h1>
              <p className="dashboard-subtitle">Monitor your team's attendance and performance</p>
            </div>
          </div>
          <div className="header-graphic">
            <ImagePlaceholder type="manager" className="manager-image" />
          </div>
        </div>
        <div className="user-badges">
          <span className="user-badge manager-badge">Team Manager</span>
          <span className="user-badge">{user?.department}</span>
          <span className="user-badge">{totalEmployees} Employees</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <motion.div
          className="stat-card stat-total"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="stat-icon">
            <FiUsers />
          </div>
          <div className="stat-content">
            <div className="stat-number">{totalEmployees}</div>
            <div className="stat-label">Total Employees</div>
            <div className="stat-trend">{getAttendanceTrend(totalEmployees, 24)}</div>
          </div>
        </motion.div>

        <motion.div
          className="stat-card stat-present"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="stat-icon">
            <FiUserCheck />
          </div>
          <div className="stat-content">
            <div className="stat-number">{presentToday}</div>
            <div className="stat-label">Present Today</div>
            <div className="stat-percentage">{attendancePercentage}%</div>
            <div className="stat-trend">{getAttendanceTrend(presentToday, 20)}</div>
          </div>
        </motion.div>

        <motion.div
          className="stat-card stat-late"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="stat-icon">
            <FiClock />
          </div>
          <div className="stat-content">
            <div className="stat-number">{lateToday}</div>
            <div className="stat-label">Late Today</div>
            <div className="stat-trend">{getAttendanceTrend(lateToday, 3)}</div>
          </div>
        </motion.div>

        <motion.div
          className="stat-card stat-absent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="stat-icon">
            <FiUserX />
          </div>
          <div className="stat-content">
            <div className="stat-number">{totalEmployees - presentToday}</div>
            <div className="stat-label">Absent Today</div>
            <div className="stat-trend">{getAttendanceTrend(totalEmployees - presentToday, 4)}</div>
          </div>
        </motion.div>
      </div>

      <div className="manager-content">
        {/* Left Column */}
        <div className="content-left">
          {/* Department Overview */}
          <motion.div 
            className="dashboard-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="card-header">
              <h2 className="card-title">
                <FiTrendingUp className="card-icon" />
                Department Overview
              </h2>
            </div>
            <div className="department-stats">
              {departmentStats.map((dept, index) => (
                <motion.div
                  key={dept.name}
                  className="department-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <div className="dept-info">
                    <div className="dept-name">{dept.name}</div>
                    <div className="dept-count">{dept.present}/{dept.total}</div>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${(dept.present / dept.total) * 100}%`
                      }}
                    ></div>
                  </div>
                  <div className="dept-percentage">
                    {Math.round((dept.present / dept.total) * 100)}%
                  </div>
                  <div className={`dept-trend ${dept.trend.startsWith('+') ? 'positive' : 'negative'}`}>
                    {dept.trend}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Today's Attendance Table */}
          <motion.div 
            className="dashboard-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="card-header">
              <h2 className="card-title">Today's Attendance Overview</h2>
              <div className="card-actions">
                <Link to="/all-attendance" className="btn btn-primary view-all-btn">
                  View All <FiArrowRight className="btn-icon" />
                </Link>
              </div>
            </div>
            <div className="table-container">
              {todayAttendance.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Status</th>
                      <th>Check In</th>
                      <th>Check Out</th>
                      <th>Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todayAttendance.slice(0, 5).map((record) => (
                      <tr key={record._id}>
                        <td>
                          <div className="employee-info">
                            <div className="user-avatar small">
                              {record.user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="employee-name">{record.user?.name}</div>
                              <div className="employee-id">{record.user?.employeeId}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span 
                            className="status-badge"
                            style={{ 
                              backgroundColor: `${getStatusColor(record.status)}20`,
                              color: getStatusColor(record.status)
                            }}
                          >
                            {record.status}
                          </span>
                        </td>
                        <td className="time-cell">
                          {record.checkInTime ? 
                            new Date(record.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                            : '--:--'
                          }
                        </td>
                        <td className="time-cell">
                          {record.checkOutTime ? 
                            new Date(record.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                            : '--:--'
                          }
                        </td>
                        <td className="hours-cell">
                          {record.totalHours > 0 ? `${record.totalHours}h` : '--'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-data">
                  <p>No attendance records for today yet.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="content-right">
          {/* Quick Actions */}
          <motion.div 
            className="dashboard-card"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="card-header">
              <h2 className="card-title">Management Tools</h2>
            </div>
            <div className="quick-actions-grid">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link to="/all-attendance" className="action-card manager-action">
                  <div className="action-icon">
                    <FiUsers />
                  </div>
                  <div className="action-content">
                    <h3 className="action-title">Team Attendance</h3>
                    <p className="action-description">View complete team attendance records</p>
                  </div>
                  <FiArrowRight className="action-arrow" />
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link to="/reports" className="action-card manager-action">
                  <div className="action-icon">
                    <FiBarChart2 />
                  </div>
                  <div className="action-content">
                    <h3 className="action-title">Analytics</h3>
                    <p className="action-description">Generate detailed reports and insights</p>
                  </div>
                  <FiArrowRight className="action-arrow" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <div className="action-card manager-action coming-soon">
                  <div className="action-icon">
                    <FiTrendingUp />
                  </div>
                  <div className="action-content">
                    <h3 className="action-title">Performance</h3>
                    <p className="action-description">Team performance metrics (Coming Soon)</p>
                  </div>
                  <span className="coming-soon-badge">Soon</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Team Performance */}
          <motion.div 
            className="dashboard-card performance-card"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="card-header">
              <h2 className="card-title">Team Performance</h2>
            </div>
            <div className="performance-stats">
              <div className="performance-item">
                <div className="performance-label">Attendance Rate</div>
                <div className="performance-value">94%</div>
                <div className="performance-trend positive">+2%</div>
              </div>
              <div className="performance-item">
                <div className="performance-label">Punctuality</div>
                <div className="performance-value">88%</div>
                <div className="performance-trend positive">+5%</div>
              </div>
              <div className="performance-item">
                <div className="performance-label">Productivity</div>
                <div className="performance-value">92%</div>
                <div className="performance-trend neutral">0%</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;