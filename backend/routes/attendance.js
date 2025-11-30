// backend/routes/attendance.js
const express = require('express');
const { 
  checkIn, 
  checkOut, 
  getMyHistory, 
  getMySummary, 
  getTodayStatus,
  getAllAttendance,
  exportToCSV
} = require('../controllers/attendanceController');
const { auth, requireManager } = require('../middleware/authMiddleware');

const router = express.Router();

// Employee routes
router.post('/checkin', auth, checkIn);
router.post('/checkout', auth, checkOut);
router.get('/my-history', auth, getMyHistory);
router.get('/my-summary', auth, getMySummary);
router.get('/today', auth, getTodayStatus);

// Manager routes
router.get('/all', auth, requireManager, getAllAttendance);
router.get('/export', auth, requireManager, exportToCSV);

module.exports = router;