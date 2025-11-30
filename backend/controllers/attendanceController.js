// backend/controllers/attendanceController.js
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const moment = require('moment');

// Check in
exports.checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = moment().startOf('day').toDate();
    
    // Check if already checked in today
    const existingAttendance = await Attendance.findOne({
      userId,
      date: today
    });

    if (existingAttendance && existingAttendance.checkInTime) {
      return res.status(400).json({ message: 'Already checked in today' });
    }

    const checkInTime = new Date();
    const checkInHour = checkInTime.getHours();
    const checkInMinute = checkInTime.getMinutes();
    
    // Determine status (late if after 9:30 AM)
    let status = 'present';
    if (checkInHour > 9 || (checkInHour === 9 && checkInMinute > 30)) {
      status = 'late';
    }

    let attendance;
    if (existingAttendance) {
      attendance = await Attendance.findOneAndUpdate(
        { userId, date: today },
        { checkInTime, status },
        { new: true }
      );
    } else {
      attendance = new Attendance({
        userId,
        date: today,
        checkInTime,
        status
      });
      await attendance.save();
    }

    await attendance.populate('userId', 'name employeeId department');

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Check out
exports.checkOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = moment().startOf('day').toDate();
    
    const attendance = await Attendance.findOne({
      userId,
      date: today
    });

    if (!attendance || !attendance.checkInTime) {
      return res.status(400).json({ message: 'Please check in first' });
    }

    if (attendance.checkOutTime) {
      return res.status(400).json({ message: 'Already checked out today' });
    }

    const checkOutTime = new Date();
    const checkInTime = attendance.checkInTime;
    
    // Calculate total hours
    const totalHours = (checkOutTime - checkInTime) / (1000 * 60 * 60);
    
    // Update status to half-day if worked less than 4 hours
    let status = attendance.status;
    if (totalHours < 4) {
      status = 'half-day';
    }

    const updatedAttendance = await Attendance.findOneAndUpdate(
      { userId, date: today },
      { checkOutTime, totalHours: parseFloat(totalHours.toFixed(2)), status },
      { new: true }
    ).populate('userId', 'name employeeId department');

    res.json(updatedAttendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get my attendance history
exports.getMyHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query;
    
    let query = { userId };
    
    if (month && year) {
      const startDate = moment(`${year}-${month}-01`).startOf('month').toDate();
      const endDate = moment(startDate).endOf('month').toDate();
      query.date = { $gte: startDate, $lte: endDate };
    }

    const attendance = await Attendance.find(query)
      .sort({ date: -1 })
      .populate('userId', 'name employeeId department');

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get monthly summary
exports.getMySummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query;
    const currentMonth = month || moment().month() + 1;
    const currentYear = year || moment().year();

    const startDate = moment(`${currentYear}-${currentMonth}-01`).startOf('month').toDate();
    const endDate = moment(startDate).endOf('month').toDate();

    const attendance = await Attendance.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    });

    const summary = {
      present: attendance.filter(a => a.status === 'present').length,
      absent: attendance.filter(a => a.status === 'absent').length,
      late: attendance.filter(a => a.status === 'late').length,
      halfDay: attendance.filter(a => a.status === 'half-day').length,
      totalHours: attendance.reduce((sum, a) => sum + a.totalHours, 0)
    };

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get today's status
exports.getTodayStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = moment().startOf('day').toDate();

    const attendance = await Attendance.findOne({
      userId,
      date: today
    }).populate('userId', 'name employeeId department');

    res.json(attendance || { date: today, status: 'absent' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Manager: Get all employees attendance
exports.getAllAttendance = async (req, res) => {
  try {
    const { employee, startDate, endDate, status } = req.query;
    
    let query = {};
    
    if (employee) {
      const users = await User.find({
        $or: [
          { name: { $regex: employee, $options: 'i' } },
          { employeeId: { $regex: employee, $options: 'i' } }
        ]
      });
      query.userId = { $in: users.map(u => u._id) };
    }
    
    if (startDate && endDate) {
      query.date = { 
        $gte: moment(startDate).startOf('day').toDate(),
        $lte: moment(endDate).endOf('day').toDate()
      };
    }
    
    if (status) {
      query.status = status;
    }

    const attendance = await Attendance.find(query)
      .populate('userId', 'name employeeId department')
      .sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Manager: Export to CSV
exports.exportToCSV = async (req, res) => {
  try {
    const { startDate, endDate, employeeId } = req.query;
    
    let query = {};
    
    if (startDate && endDate) {
      query.date = { 
        $gte: moment(startDate).startOf('day').toDate(),
        $lte: moment(endDate).endOf('day').toDate()
      };
    }
    
    if (employeeId) {
      const user = await User.findOne({ employeeId });
      if (user) {
        query.userId = user._id;
      }
    }

    const attendance = await Attendance.find(query)
      .populate('userId', 'name employeeId department')
      .sort({ date: -1 });

    const csvData = attendance.map(record => ({
      Date: moment(record.date).format('YYYY-MM-DD'),
      'Employee ID': record.userId.employeeId,
      Name: record.userId.name,
      Department: record.userId.department,
      'Check In': record.checkInTime ? moment(record.checkInTime).format('HH:mm:ss') : 'N/A',
      'Check Out': record.checkOutTime ? moment(record.checkOutTime).format('HH:mm:ss') : 'N/A',
      Status: record.status,
      'Total Hours': record.totalHours || 0
    }));

    res.json(csvData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};