// backend/routes/dashboard.js
const express = require('express');
const { auth, requireManager } = require('../middleware/authMiddleware');
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const moment = require('moment');

const router = express.Router();

// Employee dashboard
router.get('/employee', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const today = moment().startOf('day').toDate();
    const monthStart = moment().startOf('month').toDate();
    const monthEnd = moment().endOf('month').toDate();

    // Today's status
    const todayAttendance = await Attendance.findOne({
      userId,
      date: today
    });

    // Monthly summary
    const monthlyAttendance = await Attendance.find({
      userId,
      date: { $gte: monthStart, $lte: monthEnd }
    });

    const summary = {
      present: monthlyAttendance.filter(a => a.status === 'present').length,
      absent: monthlyAttendance.filter(a => a.status === 'absent').length,
      late: monthlyAttendance.filter(a => a.status === 'late').length,
      totalHours: monthlyAttendance.reduce((sum, a) => sum + a.totalHours, 0)
    };

    // Recent attendance (last 7 days)
    const weekStart = moment().subtract(7, 'days').startOf('day').toDate();
    const recentAttendance = await Attendance.find({
      userId,
      date: { $gte: weekStart, $lte: today }
    }).sort({ date: -1 });

    res.json({
      todayStatus: todayAttendance || { status: 'absent' },
      monthlySummary: summary,
      recentAttendance
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Manager dashboard
router.get('/manager', auth, requireManager, async (req, res) => {
  try {
    const today = moment().startOf('day').toDate();

    // Total employees
    const totalEmployees = await User.countDocuments({ role: 'employee' });

    // Today's attendance
    const todayAttendance = await Attendance.find({ date: today })
      .populate('userId', 'name employeeId department');

    const presentToday = todayAttendance.filter(a => 
      ['present', 'late', 'half-day'].includes(a.status)
    ).length;

    const lateToday = todayAttendance.filter(a => a.status === 'late').length;

    // Absent employees today
    const allEmployees = await User.find({ role: 'employee' });
    const presentEmployeeIds = todayAttendance.map(a => a.userId._id.toString());
    const absentEmployees = allEmployees.filter(emp => 
      !presentEmployeeIds.includes(emp._id.toString())
    );

    // Weekly trend (last 7 days)
    const weekStart = moment().subtract(7, 'days').startOf('day').toDate();
    const weeklyAttendance = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: weekStart, $lte: today }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          present: {
            $sum: { $cond: [{ $in: ["$status", ["present", "late", "half-day"]] }, 1, 0] }
          },
          total: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Department-wise attendance
    const departmentStats = await Attendance.aggregate([
      {
        $match: { date: today }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $group: {
          _id: '$user.department',
          present: {
            $sum: { $cond: [{ $in: ["$status", ["present", "late", "half-day"]] }, 1, 0] }
          },
          total: { $sum: 1 }
        }
      }
    ]);

    res.json({
      totalEmployees,
      todayAttendance: {
        present: presentToday,
        absent: totalEmployees - presentToday,
        late: lateToday
      },
      absentEmployees: absentEmployees.map(emp => ({
        name: emp.name,
        employeeId: emp.employeeId,
        department: emp.department
      })),
      weeklyTrend: weeklyAttendance,
      departmentStats
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;