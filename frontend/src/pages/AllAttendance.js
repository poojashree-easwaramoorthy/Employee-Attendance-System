import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllAttendance } from '../store/slices/attendanceSlice';
import { FiSearch, FiDownload, FiFilter, FiUsers, FiUserCheck, FiUserX, FiClock, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import ImagePlaceholder from '../components/ImagePlaceholder';

import '../styles/AllAttendance.css';

const AllAttendance = () => {
  const { allAttendance, loading, error } = useSelector(state => state.attendance);
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({
    employee: '',
    startDate: '',
    endDate: '',
    status: ''
  });
  const [appliedFilters, setAppliedFilters] = useState({});

  // Load data on component mount only
  useEffect(() => {
    dispatch(getAllAttendance());
  }, [dispatch]);

  // Apply filters only when user clicks apply
  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    dispatch(getAllAttendance(filters));
  };

  // Clear filters
  const handleClearFilters = () => {
    const clearedFilters = {
      employee: '',
      startDate: '',
      endDate: '',
      status: ''
    };
    setFilters(clearedFilters);
    setAppliedFilters(clearedFilters);
    dispatch(getAllAttendance());
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleExport = () => {
    alert('Export functionality would download CSV file');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'status-present';
      case 'absent': return 'status-absent';
      case 'late': return 'status-late';
      case 'half-day': return 'status-half-day';
      default: return 'status-absent';
    }
  };

  // Calculate team statistics
  const today = new Date().toDateString();
  const todayRecords = allAttendance.filter(record => 
    record.date && new Date(record.date).toDateString() === today
  );

  const presentCount = todayRecords.filter(r => ['present', 'late', 'half-day'].includes(r.status)).length;
  const absentCount = todayRecords.filter(r => r.status === 'absent').length;
  const lateCount = todayRecords.filter(r => r.status === 'late').length;

  const departmentStats = {
    'Engineering': { present: 12, total: 15 },
    'Design': { present: 8, total: 10 },
    'Marketing': { present: 6, total: 8 },
    'Sales': { present: 10, total: 12 }
  };

  // Show error state if needed
  if (error) {
    return (
      <div className="error-state">
        <div className="error-content">
          <h3>Error Loading Data</h3>
          <p>{error}</p>
          <button onClick={() => dispatch(getAllAttendance())} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="all-attendance">
      {/* Header */}
      <motion.div 
        className="page-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="header-content">
          <div className="header-text">
            <h1 className="page-title">Team Attendance</h1>
            <p className="page-subtitle">Monitor and manage your team's attendance records</p>
          </div>
          <div className="header-graphic">
            <ImagePlaceholder type="reports" className="header-image" />
          </div>
        </div>
        
        <div className="header-stats">
          <div className="stat-badge">
            <FiUsers className="stat-icon" />
            <span>{allAttendance.length} Records</span>
          </div>
          <div className="stat-badge">
            <FiUserCheck className="stat-icon" />
            <span>{presentCount} Present Today</span>
          </div>
          <button onClick={handleExport} className="btn btn-primary export-btn">
            <FiDownload className="btn-icon" /> Export Report
          </button>
        </div>
      </motion.div>

      <div className="attendance-content">
        {/* Left Column - Overview & Filters */}
        <div className="content-left">
          {/* Quick Stats */}
          <motion.div 
            className="overview-cards"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="overview-card total">
              <div className="overview-icon">
                <FiUsers />
              </div>
              <div className="overview-content">
                <div className="overview-number">{allAttendance.length}</div>
                <div className="overview-label">Total Records</div>
              </div>
            </div>
            <div className="overview-card present">
              <div className="overview-icon">
                <FiUserCheck />
              </div>
              <div className="overview-content">
                <div className="overview-number">{presentCount}</div>
                <div className="overview-label">Present Today</div>
              </div>
            </div>
            <div className="overview-card absent">
              <div className="overview-icon">
                <FiUserX />
              </div>
              <div className="overview-content">
                <div className="overview-number">{absentCount}</div>
                <div className="overview-label">Absent Today</div>
              </div>
            </div>
            <div className="overview-card late">
              <div className="overview-icon">
                <FiClock />
              </div>
              <div className="overview-content">
                <div className="overview-number">{lateCount}</div>
                <div className="overview-label">Late Today</div>
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div 
            className="filters-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="filters-title">
              <FiFilter className="title-icon" />
              Filter Records
            </h3>
            
            <div className="filters-grid">
              <div className="filter-group">
                <label htmlFor="employee" className="filter-label">
                  <FiSearch className="filter-icon" /> Search Employee
                </label>
                <input
                  type="text"
                  id="employee"
                  name="employee"
                  placeholder="Search by name or ID"
                  value={filters.employee}
                  onChange={handleFilterChange}
                  className="filter-input"
                />
              </div>
              
              <div className="filter-group">
                <label htmlFor="startDate" className="filter-label">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  className="filter-input"
                />
              </div>
              
              <div className="filter-group">
                <label htmlFor="endDate" className="filter-label">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  className="filter-input"
                />
              </div>
              
              <div className="filter-group">
                <label htmlFor="status" className="filter-label">Status</label>
                <select 
                  id="status"
                  name="status" 
                  value={filters.status} 
                  onChange={handleFilterChange} 
                  className="filter-input"
                >
                  <option value="">All Status</option>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                  <option value="half-day">Half Day</option>
                </select>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="filter-actions">
              <button onClick={handleApplyFilters} className="btn btn-primary">
                Apply Filters
              </button>
              <button onClick={handleClearFilters} className="btn btn-secondary">
                Clear Filters
              </button>
            </div>

            {/* Active Filters Display */}
            {Object.values(appliedFilters).some(value => value) && (
              <div className="active-filters">
                <span className="active-filters-label">Active Filters:</span>
                {appliedFilters.employee && (
                  <span className="filter-tag">Employee: {appliedFilters.employee}</span>
                )}
                {appliedFilters.startDate && (
                  <span className="filter-tag">From: {appliedFilters.startDate}</span>
                )}
                {appliedFilters.endDate && (
                  <span className="filter-tag">To: {appliedFilters.endDate}</span>
                )}
                {appliedFilters.status && (
                  <span className="filter-tag">Status: {appliedFilters.status}</span>
                )}
              </div>
            )}
          </motion.div>

          {/* Department Overview */}
          <motion.div 
            className="department-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="card-title">Department Overview</h3>
            <div className="department-list">
              {Object.entries(departmentStats).map(([dept, stats], index) => (
                <motion.div
                  key={dept}
                  className="department-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <div className="dept-info">
                    <div className="dept-name">{dept}</div>
                    <div className="dept-stats">
                      {stats.present}/{stats.total} Present
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${(stats.present / stats.total) * 100}%` }}
                    ></div>
                  </div>
                  <div className="dept-percentage">
                    {Math.round((stats.present / stats.total) * 100)}%
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Attendance Table */}
        <div className="content-right">
          <motion.div 
            className="table-card"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="card-header">
              <h2 className="card-title">Attendance Records</h2>
              <div className="table-actions">
                <div className="records-count">
                  Showing {allAttendance.length} records
                  {loading && ' (Loading...)'}
                </div>
              </div>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading attendance data...</p>
                <small>Please wait while we fetch the records</small>
              </div>
            ) : (
              <>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Date</th>
                        <th>Check In</th>
                        <th>Check Out</th>
                        <th>Status</th>
                        <th>Hours</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allAttendance.map((record, index) => (
                        <motion.tr 
                          key={record._id || index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="table-row"
                        >
                          <td>
                            <div className="employee-info">
                              <div className="user-avatar small">
                                {record.userId?.name?.charAt(0).toUpperCase() || 'U'}
                              </div>
                              <div className="employee-details">
                                <div className="employee-name">{record.userId?.name || 'Unknown User'}</div>
                                <div className="employee-id">{record.userId?.employeeId || 'N/A'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="date-cell">
                            {record.date ? new Date(record.date).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="time-cell">
                            {record.checkInTime 
                              ? new Date(record.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                              : '--:--'
                            }
                          </td>
                          <td className="time-cell">
                            {record.checkOutTime 
                              ? new Date(record.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                              : '--:--'
                            }
                          </td>
                          <td className="status-cell">
                            <span className={`status-badge ${getStatusColor(record.status)}`}>
                              {record.status ? record.status.charAt(0).toUpperCase() + record.status.slice(1) : 'Unknown'}
                            </span>
                          </td>
                          <td className="hours-cell">
                            {record.totalHours ? `${record.totalHours}h` : '0h'}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {allAttendance.length === 0 && !loading && (
                  <div className="no-data">
                    <div className="no-data-icon">📊</div>
                    <p>No attendance records found</p>
                    <span>Try adjusting your filters or check back later</span>
                  </div>
                )}
              </>
            )}

            {/* Pagination */}
            {allAttendance.length > 0 && (
              <div className="pagination">
                <button className="pagination-btn" disabled>Previous</button>
                <span className="pagination-info">Page 1 of 1</span>
                <button className="pagination-btn" disabled>Next</button>
              </div>
            )}
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            className="actions-card"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="card-title">Quick Actions</h3>
            <div className="action-buttons">
              <button className="action-btn primary">
                <FiDownload className="btn-icon" />
                Export Monthly Report
              </button>
              <button className="action-btn secondary">
                <FiUsers className="btn-icon" />
                Send Reminders
              </button>
              <button className="action-btn secondary">
                <FiArrowRight className="btn-icon" />
                View Analytics
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AllAttendance;