import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getMe } from './store/slices/authSlice';

// Components
import Login from './pages/Login';
import Register from './pages/Register';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import AttendanceHistory from './pages/AttendanceHistory';
import MarkAttendance from './pages/MarkAttendance';
import AllAttendance from './pages/AllAttendance';
import Reports from './pages/Reports';
import Layout from './components/Layout';

function App() {
  const { isAuthenticated, user, loading } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(getMe());
    }
  }, [dispatch]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} 
          />
          <Route 
            path="/register" 
            element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" replace />} 
          />
          
          {/* Protected Routes with Layout */}
          <Route 
            path="/" 
            element={isAuthenticated ? <Layout /> : <Navigate to="/login" replace />}
          >
            <Route 
              path="dashboard" 
              element={user?.role === 'manager' ? <ManagerDashboard /> : <EmployeeDashboard />} 
            />
            <Route path="attendance" element={<MarkAttendance />} />
            <Route path="history" element={<AttendanceHistory />} />
            
            {/* Manager-only routes */}
            {user?.role === 'manager' && (
              <>
                <Route path="all-attendance" element={<AllAttendance />} />
                <Route path="reports" element={<Reports />} />
              </>
            )}
            
            <Route index element={<Navigate to="/dashboard" replace />} />
          </Route>
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;