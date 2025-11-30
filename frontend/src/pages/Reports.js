import React, { useState } from 'react';
import { FiDownload, FiCalendar, FiUser, FiBarChart2, FiPieChart, FiTrendingUp, FiUsers, FiUserCheck, FiClock } from 'react-icons/fi';
import { motion } from 'framer-motion';
import ImagePlaceholder from '../components/ImagePlaceholder';

import '../styles/Reports.css';

const Reports = () => {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    employeeId: '',
    reportType: 'attendance'
  });

  const [generating, setGenerating] = useState(false);
  const [reportData, setReportData] = useState(null);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const generateSampleReportData = () => {
    return {
      title: `${filters.reportType.charAt(0).toUpperCase() + filters.reportType.slice(1)} Report`,
      period: filters.startDate && filters.endDate 
        ? `${filters.startDate} to ${filters.endDate}`
        : 'Last 30 days',
      generatedOn: new Date().toLocaleDateString(),
      totalRecords: Math.floor(Math.random() * 1000) + 500,
      summary: {
        totalEmployees: 45,
        presentToday: 38,
        attendanceRate: 84.4,
        avgHours: 8.2,
        lateArrivals: 12,
        absences: 7
      },
      data: Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        employee: `Employee ${i + 1}`,
        department: ['Engineering', 'Design', 'Marketing', 'Sales'][i % 4],
        present: Math.floor(Math.random() * 20) + 15,
        absent: Math.floor(Math.random() * 5),
        late: Math.floor(Math.random() * 3),
        totalHours: (Math.random() * 40 + 120).toFixed(1)
      }))
    };
  };

  const handleGenerateReport = () => {
    setGenerating(true);
    // Simulate report generation
    setTimeout(() => {
      const data = generateSampleReportData();
      setReportData(data);
      setGenerating(false);
    }, 2000);
  };

  const handleExport = (format) => {
    if (!reportData) {
      alert('Please generate a report first!');
      return;
    }

    switch (format) {
      case 'pdf':
        downloadPDF();
        break;
      case 'excel':
        downloadExcel();
        break;
      case 'csv':
        downloadCSV();
        break;
      default:
        break;
    }
  };

  const downloadPDF = () => {
    // Simulate PDF download
    const element = document.createElement('a');
    const file = new Blob([`PDF Report: ${reportData.title}\n\nPeriod: ${reportData.period}\nGenerated: ${reportData.generatedOn}\n\nSummary:\n- Total Employees: ${reportData.summary.totalEmployees}\n- Attendance Rate: ${reportData.summary.attendanceRate}%\n- Average Hours: ${reportData.summary.avgHours}h`], { type: 'application/pdf' });
    element.href = URL.createObjectURL(file);
    element.download = `${reportData.title.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadExcel = () => {
    // Create CSV content (simulating Excel)
    const headers = ['Employee', 'Department', 'Present Days', 'Absent Days', 'Late Days', 'Total Hours'];
    const csvContent = [
      headers.join(','),
      ...reportData.data.map(row => [
        row.employee,
        row.department,
        row.present,
        row.absent,
        row.late,
        row.totalHours
      ].join(','))
    ].join('\n');

    const element = document.createElement('a');
    const file = new Blob([csvContent], { type: 'text/csv' });
    element.href = URL.createObjectURL(file);
    element.download = `${reportData.title.replace(/\s+/g, '_')}_${new Date().getTime()}.csv`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadCSV = () => {
    // Create detailed CSV
    const headers = ['ID', 'Employee', 'Department', 'Present', 'Absent', 'Late', 'Total Hours'];
    const csvContent = [
      headers.join(','),
      ...reportData.data.map(row => [
        row.id,
        row.employee,
        row.department,
        row.present,
        row.absent,
        row.late,
        row.totalHours
      ].join(','))
    ].join('\n');

    const element = document.createElement('a');
    const file = new Blob([csvContent], { type: 'text/csv' });
    element.href = URL.createObjectURL(file);
    element.download = `${reportData.title.replace(/\s+/g, '_')}_detailed_${new Date().getTime()}.csv`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadRecentReport = (report) => {
    const element = document.createElement('a');
    const content = `Report: ${report.name}\nDate: ${report.date}\nType: ${report.type}\n\nThis is a sample downloaded report.`;
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${report.name.replace(/\s+/g, '_')}_${new Date().getTime()}.${report.type.toLowerCase()}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const reportTypes = [
    {
      id: 'attendance',
      name: 'Attendance Summary',
      icon: '📊',
      description: 'Overall attendance statistics and trends'
    },
    {
      id: 'department',
      name: 'Department Report',
      icon: '👥',
      description: 'Department-wise attendance analysis'
    },
    {
      id: 'individual',
      name: 'Individual Report',
      icon: '👤',
      description: 'Detailed individual attendance records'
    },
    {
      id: 'late',
      name: 'Late Arrivals',
      icon: '⏰',
      description: 'Analysis of late arrivals and patterns'
    }
  ];

  const sampleData = {
    totalEmployees: 45,
    presentToday: 38,
    attendanceRate: 84.4,
    avgHours: 8.2
  };

  const recentReports = [
    { name: 'Monthly Attendance - Nov 2024', date: '2 days ago', type: 'PDF' },
    { name: 'Department Analysis - Engineering', date: '1 week ago', type: 'Excel' },
    { name: 'Late Arrivals Report', date: '2 weeks ago', type: 'CSV' }
  ];

  return (
    <div className="reports">
      {/* Header */}
      <motion.div 
        className="reports-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="header-content">
          <div className="header-text">
            <h1 className="page-title">Analytics & Reports</h1>
            <p className="page-subtitle">Generate detailed insights and attendance analytics</p>
          </div>
          <div className="header-graphic">
            <ImagePlaceholder type="reports" className="header-image" />
          </div>
        </div>
        
        <div className="header-stats">
          <div className="stat-item">
            <div className="stat-value">{sampleData.totalEmployees}</div>
            <div className="stat-label">Total Employees</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{sampleData.presentToday}</div>
            <div className="stat-label">Present Today</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{sampleData.attendanceRate}%</div>
            <div className="stat-label">Attendance Rate</div>
          </div>
        </div>
      </motion.div>

      <div className="reports-content">
        {/* Left Column - Report Configuration */}
        <div className="config-column">
          <motion.div 
            className="config-card"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="card-title">
              <FiBarChart2 className="card-icon" />
              Generate Report
            </h2>
            
            {/* Report Type Selection */}
            <div className="report-type-selection">
              <h3 className="section-title">Report Type</h3>
              <div className="type-grid">
                {reportTypes.map((type, index) => (
                  <motion.label
                    key={type.id}
                    className="type-option"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <input
                      type="radio"
                      name="reportType"
                      value={type.id}
                      checked={filters.reportType === type.id}
                      onChange={handleFilterChange}
                    />
                    <div className="type-card">
                      <div className="type-icon">{type.icon}</div>
                      <div className="type-content">
                        <div className="type-name">{type.name}</div>
                        <div className="type-description">{type.description}</div>
                      </div>
                    </div>
                  </motion.label>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div className="filters-section">
              <h3 className="section-title">Report Parameters</h3>
              <div className="filters-grid">
                <div className="filter-group">
                  <label htmlFor="startDate" className="filter-label">
                    <FiCalendar className="filter-icon" />
                    Start Date
                  </label>
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
                  <label htmlFor="endDate" className="filter-label">
                    <FiCalendar className="filter-icon" />
                    End Date
                  </label>
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
                  <label htmlFor="employeeId" className="filter-label">
                    <FiUser className="filter-icon" />
                    Employee (Optional)
                  </label>
                  <input
                    type="text"
                    id="employeeId"
                    name="employeeId"
                    placeholder="Enter employee ID"
                    value={filters.employeeId}
                    onChange={handleFilterChange}
                    className="filter-input"
                  />
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <motion.button 
              onClick={handleGenerateReport}
              disabled={generating}
              className="btn btn-primary generate-btn"
              whileHover={{ scale: generating ? 1 : 1.02 }}
              whileTap={{ scale: generating ? 1 : 0.98 }}
            >
              {generating ? (
                <>
                  <div className="loading-spinner-small"></div>
                  Generating Report...
                </>
              ) : (
                <>
                  <FiDownload className="btn-icon" />
                  Generate Report
                </>
              )}
            </motion.button>

            {/* Report Status */}
            {reportData && (
              <motion.div 
                className="report-status"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <div className="status-success">
                  ✅ Report generated successfully! Ready for download.
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Export Options */}
          <motion.div 
            className="export-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="card-title">Export Options</h3>
            <div className="export-options">
              <button 
                className="export-option"
                onClick={() => handleExport('pdf')}
                disabled={!reportData}
              >
                <div className="option-icon">📄</div>
                <div className="option-content">
                  <div className="option-name">PDF Report</div>
                  <div className="option-description">Formatted document</div>
                </div>
              </button>
              <button 
                className="export-option"
                onClick={() => handleExport('excel')}
                disabled={!reportData}
              >
                <div className="option-icon">📊</div>
                <div className="option-content">
                  <div className="option-name">Excel Spreadsheet</div>
                  <div className="option-description">Raw data export</div>
                </div>
              </button>
              <button 
                className="export-option"
                onClick={() => handleExport('csv')}
                disabled={!reportData}
              >
                <div className="option-icon">📈</div>
                <div className="option-content">
                  <div className="option-name">CSV Data</div>
                  <div className="option-description">For analysis</div>
                </div>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Preview & Analytics */}
        <div className="preview-column">
          {/* Quick Stats */}
          <motion.div 
            className="stats-card"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="card-title">Quick Overview</h3>
            <div className="stats-grid">
              <div className="stat-card present">
                <div className="stat-icon">
                  <FiUserCheck />
                </div>
                <div className="stat-content">
                  <div className="stat-number">84.4%</div>
                  <div className="stat-label">Attendance Rate</div>
                </div>
              </div>
              <div className="stat-card late">
                <div className="stat-icon">
                  <FiClock />
                </div>
                <div className="stat-content">
                  <div className="stat-number">12</div>
                  <div className="stat-label">Late Arrivals</div>
                </div>
              </div>
              <div className="stat-card hours">
                <div className="stat-icon">
                  <FiTrendingUp />
                </div>
                <div className="stat-content">
                  <div className="stat-number">8.2</div>
                  <div className="stat-label">Avg Hours/Day</div>
                </div>
              </div>
              <div className="stat-card total">
                <div className="stat-icon">
                  <FiUsers />
                </div>
                <div className="stat-content">
                  <div className="stat-number">45</div>
                  <div className="stat-label">Total Employees</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Report Preview */}
          <motion.div 
            className="preview-card"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="card-title">
              <FiPieChart className="card-icon" />
              Report Preview
            </h3>
            <div className="preview-content">
              {reportData ? (
                <>
                  <div className="report-preview">
                    <div className="preview-header">
                      <h4>{reportData.title}</h4>
                      <p>Period: {reportData.period}</p>
                    </div>
                    <div className="preview-data">
                      <div className="data-summary">
                        <div className="summary-item">
                          <span>Total Records:</span>
                          <strong>{reportData.totalRecords}</strong>
                        </div>
                        <div className="summary-item">
                          <span>Generated:</span>
                          <strong>{reportData.generatedOn}</strong>
                        </div>
                      </div>
                      <div className="data-table-preview">
                        <table>
                          <thead>
                            <tr>
                              <th>Employee</th>
                              <th>Department</th>
                              <th>Present</th>
                              <th>Hours</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reportData.data.slice(0, 5).map(row => (
                              <tr key={row.id}>
                                <td>{row.employee}</td>
                                <td>{row.department}</td>
                                <td>{row.present}</td>
                                <td>{row.totalHours}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="chart-placeholder">
                  <div className="placeholder-graphic">
                    <ImagePlaceholder type="reports" className="preview-image" />
                  </div>
                  <div className="placeholder-text">
                    <h4>Attendance Distribution</h4>
                    <p>Select parameters and generate report to view detailed analytics and visualizations</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Reports */}
          <motion.div 
            className="recent-card"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h3 className="card-title">Recent Reports</h3>
            <div className="reports-list">
              {recentReports.map((report, index) => (
                <motion.div
                  key={report.name}
                  className="report-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <div className="report-icon">📋</div>
                  <div className="report-content">
                    <div className="report-name">{report.name}</div>
                    <div className="report-meta">
                      <span className="report-date">{report.date}</span>
                      <span className="report-type">{report.type}</span>
                    </div>
                  </div>
                  <button 
                    className="download-btn"
                    onClick={() => downloadRecentReport(report)}
                  >
                    <FiDownload />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Reports;