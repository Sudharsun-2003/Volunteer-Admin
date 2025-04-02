import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Opportunities from './pages/Opportunities';
import Applications from './pages/Applications';
import AdminSignup from './pages/Signup';
import { AuthProvider } from './context/AuthContext';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          {/* <Route path="/signup" element={<AdminLayout setIsAuthenticated={setIsAuthenticated}/>} /> */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="opportunities" element={<Opportunities />} />
            <Route path="applications" element={<Applications />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
