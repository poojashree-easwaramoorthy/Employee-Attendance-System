// src/App.js
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
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/register" 
            element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} 
          />
          
          {isAuthenticated && (
            <Route path="/" element={<Layout />}>
              <Route 
                path="dashboard" 
                element={user?.role === 'manager' ? <ManagerDashboard /> : <EmployeeDashboard />} 
              />
              <Route path="attendance" element={<MarkAttendance />} />
              <Route path="history" element={<AttendanceHistory />} />
              
              {user?.role === 'manager' && (
                <>
                  <Route path="all-attendance" element={<AllAttendance />} />
                  <Route path="reports" element={<Reports />} />
                </>
              )}
              
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Route>
          )}
          
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;