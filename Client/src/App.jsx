import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './Pages/Login';

// Vehicle Manager
import VehicleManagerDashboard from './pages/VehicleManager/Dashboard';
import CreateRequest from './pages/VehicleManager/CreateRequest';
import RequestsList from './Pages/VehicleManager/RequestsList';
import Vehicles from './pages/VehicleManager/Vehicles';

// Jr Executive
import JrExecutiveDashboard from './Pages/JrExecutive/Dashboard';
import AllIssues from './Pages/JrExecutive/Allissues';
import IssueDetails from './Pages/JrExecutive/IssueDetails';
import PendingApprovals from './Pages/JrExecutive/PendingApprovals';
import ApprovedIssues from './Pages/JrExecutive/Approvedissues';
import RejectedIssues from './Pages/JrExecutive/RejectedIssues';

// OIC
import OICDashboard from './pages/OIC/Dashboard';

// Supplier
import SupplierDashboard from './pages/Supplier/Dashboard';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-military-950">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Redirect based on role
const RoleBasedRedirect = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case 'Vehicle Manager':
      return <Navigate to="/dashboard/vehicle-manager" replace />;
    case 'Jr Executive Engineer':
      return <Navigate to="/dashboard/jr-executive" replace />;
    case 'OIC':
      return <Navigate to="/dashboard/oic" replace />;
    case 'Supplier':
      return <Navigate to="/dashboard/supplier" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Root redirect */}
          <Route path="/" element={<RoleBasedRedirect />} />

          {/* Vehicle Manager Routes */}
          <Route
            path="/dashboard/vehicle-manager"
            element={
              <ProtectedRoute allowedRoles={['Vehicle Manager']}>
                <VehicleManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/vehicle-manager/create"
            element={
              <ProtectedRoute allowedRoles={['Vehicle Manager']}>
                <CreateRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/vehicle-manager/requests"
            element={
              <ProtectedRoute allowedRoles={['Vehicle Manager']}>
                <RequestsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/vehicle-manager/vehicles"
            element={
              <ProtectedRoute allowedRoles={['Vehicle Manager']}>
                <Vehicles />
              </ProtectedRoute>
            }
          />

          {/* Jr Executive Routes */}
          <Route
            path="/dashboard/jr-executive"
            element={
              <ProtectedRoute allowedRoles={['Jr Executive Engineer']}>
                <JrExecutiveDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/jr-executive/all-issues"
            element={
              <ProtectedRoute allowedRoles={['Jr Executive Engineer']}>
                <AllIssues />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/jr-executive/issue-details"
            element={
              <ProtectedRoute allowedRoles={['Jr Executive Engineer']}>
                <IssueDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/jr-executive/pending-approvals"
            element={
              <ProtectedRoute allowedRoles={['Jr Executive Engineer']}>
                <PendingApprovals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/jr-executive/approved"
            element={
              <ProtectedRoute allowedRoles={['Jr Executive Engineer']}>
                <ApprovedIssues />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/jr-executive/rejected"
            element={
              <ProtectedRoute allowedRoles={['Jr Executive Engineer']}>
                <RejectedIssues />
              </ProtectedRoute>
            }
          />

          {/* OIC Routes */}
          <Route
            path="/dashboard/oic"
            element={
              <ProtectedRoute allowedRoles={['OIC']}>
                <OICDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/oic/pending"
            element={
              <ProtectedRoute allowedRoles={['OIC']}>
                <OICDashboard />
              </ProtectedRoute>
            }
          />

          {/* Supplier Routes */}
          <Route
            path="/dashboard/supplier"
            element={
              <ProtectedRoute allowedRoles={['Supplier']}>
                <SupplierDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/supplier/approved"
            element={
              <ProtectedRoute allowedRoles={['Supplier']}>
                <SupplierDashboard />
              </ProtectedRoute>
            }
          />

          {/* Unauthorized */}
          <Route
            path="/unauthorized"
            element={
              <div className="min-h-screen flex items-center justify-center bg-military-950">
                <div className="card p-8 text-center max-w-md">
                  <h1 className="text-2xl font-bold text-red-400 mb-4">Unauthorized Access</h1>
                  <p className="text-military-400 mb-6">
                    You don't have permission to access this page.
                  </p>
                  <button
                    onClick={() => window.location.href = '/'}
                    className="btn-primary"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            }
          />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center bg-military-950">
                <div className="card p-8 text-center max-w-md">
                  <h1 className="text-2xl font-bold text-military-100 mb-4">404 - Page Not Found</h1>
                  <p className="text-military-400 mb-6">
                    The page you're looking for doesn't exist.
                  </p>
                  <button
                    onClick={() => window.location.href = '/'}
                    className="btn-primary"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;