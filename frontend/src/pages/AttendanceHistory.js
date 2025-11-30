import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Calendar from 'react-calendar';
import { getMyHistory, getMySummary } from '../store/slices/attendanceSlice';
import { FiCalendar, FiFilter, FiTrendingUp, FiAward, FiClock, FiBarChart2 } from 'react-icons/fi';
import { motion } from 'framer-motion';
import ImagePlaceholder from '../components/ImagePlaceholder';

import '../styles/AttendanceHistory.css';
import 'react-calendar/dist/Calendar.css';

const AttendanceHistory = () => {
  const { myHistory, mySummary } = useSelector(state => state.attendance);
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [view, setView] = useState('calendar'); // 'calendar' or 'list'

  useEffect(() => {
    dispatch(getMyHistory({ month: selectedMonth, year: selectedYear }));
    dispatch(getMySummary({ month: selectedMonth, year: selectedYear }));
  }, [dispatch, selectedMonth, selectedYear]);

  const getTileClassName = ({ date, view }) => {
    if (view === 'month') {
      const record = myHistory.find(record => 
        new Date(record.date).toDateString() === date.toDateString()
      );
      if (record) {
        return `calendar-tile attendance-${record.status}`;
      }
    }
    return '';
  };

  const getDateDetails = (date) => {
    return myHistory.find(record => 
      new Date(record.date).toDateString() === date.toDateString()
    );
  };

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(0, i).toLocaleString('default', { month: 'long' })
  }));

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  const attendanceStats = [
    {
      label: 'On Time',
      value: Math.round(((mySummary?.present || 0) / 22) * 100),
      icon: '⏰',
      color: '#27ae60'
    },
    {
      label: 'Productivity',
      value: 94,
      icon: '📈',
      color: '#3498db'
    },
    {
      label: 'Consistency',
      value: 88,
      icon: '🔥',
      color: '#e67e22'
    }
  ];

  const recentRecords = myHistory.slice(0, 5);

  return (
    <div className="attendance-history">
      {/* Header */}
      <motion.div 
        className="history-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="header-content">
          <div className="user-greeting">
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="page-title">Attendance History</h1>
              <p className="page-subtitle">Track your attendance patterns and history</p>
            </div>
          </div>
          <div className="header-graphic">
            <ImagePlaceholder type="history" className="history-image" />
          </div>
        </div>
        
        <div className="view-toggle">
          <button 
            className={`toggle-btn ${view === 'calendar' ? 'active' : ''}`}
            onClick={() => setView('calendar')}
          >
            <FiCalendar /> Calendar View
          </button>
          <button 
            className={`toggle-btn ${view === 'list' ? 'active' : ''}`}
            onClick={() => setView('list')}
          >
            <FiBarChart2 /> List View
          </button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div 
        className="filters-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="filters-card">
          <div className="filter-group">
            <FiFilter className="filter-icon" />
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="filter-select"
            >
              {months.map(month => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="filter-select"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className="quick-stats">
            <div className="quick-stat">
              <div className="stat-icon present">✅</div>
              <span>{mySummary?.present || 0} Present</span>
            </div>
            <div className="quick-stat">
              <div className="stat-icon absent">❌</div>
              <span>{mySummary?.absent || 0} Absent</span>
            </div>
            <div className="quick-stat">
              <div className="stat-icon late">⏰</div>
              <span>{mySummary?.late || 0} Late</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="history-content">
        {/* Left Column - Calendar & Details */}
        <div className="content-left">
          {view === 'calendar' ? (
            <motion.div 
              className="calendar-section"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="calendar-card">
                <Calendar
                  onChange={setSelectedDate}
                  value={selectedDate}
                  tileClassName={getTileClassName}
                  className="attendance-calendar"
                />
              </div>
              
              <motion.div 
                className="details-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="details-title">
                  <FiCalendar className="details-icon" /> 
                  Details for {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                {(() => {
                  const record = getDateDetails(selectedDate);
                  return record ? (
                    <div className="date-details">
                      <div className="detail-header">
                        <div className={`status-badge status-${record.status}`}>
                          {record.status?.charAt(0).toUpperCase() + record.status?.slice(1)}
                        </div>
                        <div className="detail-date">
                          {new Date(record.date).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="timeline">
                        {record.checkInTime && (
                          <div className="timeline-item">
                            <div className="timeline-marker in"></div>
                            <div className="timeline-content">
                              <div className="timeline-label">Check In</div>
                              <div className="timeline-time">
                                {new Date(record.checkInTime).toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </div>
                            </div>
                          </div>
                        )}
                        {record.checkOutTime && (
                          <div className="timeline-item">
                            <div className="timeline-marker out"></div>
                            <div className="timeline-content">
                              <div className="timeline-label">Check Out</div>
                              <div className="timeline-time">
                                {new Date(record.checkOutTime).toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {record.totalHours > 0 && (
                        <div className="total-hours">
                          <FiClock className="hours-icon" />
                          <span>Total Hours: </span>
                          <strong>{record.totalHours}h</strong>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="no-record">
                      <div className="no-record-icon">📝</div>
                      <p>No attendance record for this date</p>
                      <span>This appears to be a non-working day</span>
                    </div>
                  );
                })()}
              </motion.div>
            </motion.div>
          ) : (
            /* List View */
            <motion.div 
              className="list-section"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="list-card">
                <h3 className="card-title">Recent Attendance Records</h3>
                <div className="records-list">
                  {recentRecords.map((record, index) => (
                    <motion.div
                      key={record._id}
                      className="record-item"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <div className="record-date">
                        {new Date(record.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="record-status">
                        <span className={`status-dot ${record.status}`}></span>
                        {record.status}
                      </div>
                      <div className="record-times">
                        {record.checkInTime && (
                          <span className="time in">
                            {new Date(record.checkInTime).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        )}
                        {record.checkOutTime && (
                          <span className="time out">
                            {new Date(record.checkOutTime).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        )}
                      </div>
                      <div className="record-hours">
                        {record.totalHours || 0}h
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Column - Stats & Summary */}
        <div className="content-right">
          {/* Performance Stats */}
          <motion.div 
            className="stats-card"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="card-title">
              <FiTrendingUp className="card-icon" />
              Your Performance
            </h3>
            <div className="performance-stats">
              {attendanceStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="performance-item"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <div className="performance-icon" style={{ color: stat.color }}>
                    {stat.icon}
                  </div>
                  <div className="performance-content">
                    <div className="performance-value">{stat.value}%</div>
                    <div className="performance-label">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Monthly Summary */}
          {mySummary && (
            <motion.div 
              className="summary-card"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="card-title">
                <FiAward className="card-icon" />
                Monthly Summary - {months[selectedMonth - 1]?.label} {selectedYear}
              </h3>
              <div className="summary-cards">
                <div className="summary-card-item present">
                  <div className="summary-content">
                    <h3 className="summary-label">Present</h3>
                    <p className="summary-count">{mySummary.present || 0}</p>
                    <div className="summary-trend">+2 from last month</div>
                  </div>
                </div>
                <div className="summary-card-item absent">
                  <div className="summary-content">
                    <h3 className="summary-label">Absent</h3>
                    <p className="summary-count">{mySummary.absent || 0}</p>
                    <div className="summary-trend">-1 from last month</div>
                  </div>
                </div>
                <div className="summary-card-item late">
                  <div className="summary-content">
                    <h3 className="summary-label">Late</h3>
                    <p className="summary-count">{mySummary.late || 0}</p>
                    <div className="summary-trend">No change</div>
                  </div>
                </div>
                <div className="summary-card-item hours">
                  <div className="summary-content">
                    <h3 className="summary-label">Total Hours</h3>
                    <p className="summary-count">{mySummary.totalHours?.toFixed(1) || 0}</p>
                    <div className="summary-trend">+5.2 from last month</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Achievement */}
          <motion.div 
            className="achievement-card"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="achievement-icon">🏆</div>
            <div className="achievement-content">
              <h4>Perfect Attendance</h4>
              <p>You've maintained perfect attendance for 3 weeks!</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceHistory;