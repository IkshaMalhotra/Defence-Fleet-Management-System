import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { maintenanceAPI, handleAPIError } from '../../utils/api';
import { 
  Plus, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Clock,
  TrendingUp,
  FileText,
  Truck
} from 'lucide-react';

const VehicleManagerDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await maintenanceAPI.getMyRequests();
      const requests = response.data;

      // Calculate stats
      const stats = {
        total: requests.length,
        pending: requests.filter(r => 
          r.jrExecutiveStatus.status === 'Pending' || 
          r.oicStatus.status === 'Pending'
        ).length,
        approved: requests.filter(r => 
          r.jrExecutiveStatus.status === 'Approved' && 
          r.oicStatus.status === 'Approved'
        ).length,
        rejected: requests.filter(r => 
          r.jrExecutiveStatus.status === 'Rejected' || 
          r.oicStatus.status === 'Rejected'
        ).length,
      };

      setStats(stats);
      setRecentRequests(requests.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', handleAPIError(error));
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (request) => {
    if (request.jrExecutiveStatus.status === 'Rejected' || request.oicStatus.status === 'Rejected') {
      return <span className="status-rejected">Rejected</span>;
    }
    if (request.jrExecutiveStatus.status === 'Approved' && request.oicStatus.status === 'Approved') {
      return <span className="status-approved">Fully Approved</span>;
    }
    if (request.jrExecutiveStatus.status === 'Approved') {
      return <span className="status-pending">Awaiting OIC</span>;
    }
    return <span className="status-pending">Awaiting Jr Exec</span>;
  };

  const StatCard = ({ icon: Icon, label, value, color, bgColor }) => (
    <div className="card card-hover p-6 relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-32 h-32 ${bgColor} opacity-10 rounded-full -mr-16 -mt-16`}></div>
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
        </div>
        <h3 className="text-3xl font-bold text-military-100 mb-1">{value}</h3>
        <p className="text-military-400 text-sm font-medium">{label}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="loading-spinner"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-military-100 mb-2">
              Dashboard
            </h1>
            <p className="text-military-400">
              Overview of all maintenance requests
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard/vehicle-manager/create')}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Request
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={FileText}
            label="Total Requests"
            value={stats.total}
            color="text-blue-400"
            bgColor="bg-blue-500"
          />
          <StatCard
            icon={Clock}
            label="Pending Approval"
            value={stats.pending}
            color="text-amber-400"
            bgColor="bg-amber-500"
          />
          <StatCard
            icon={CheckCircle2}
            label="Approved"
            value={stats.approved}
            color="text-green-400"
            bgColor="bg-green-500"
          />
          <StatCard
            icon={XCircle}
            label="Rejected"
            value={stats.rejected}
            color="text-red-400"
            bgColor="bg-red-500"
          />
        </div>

        {/* Recent Requests */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-semibold text-military-100">
              Recent Requests
            </h2>
            <button
              onClick={() => navigate('/dashboard/vehicle-manager/requests')}
              className="text-olive-400 hover:text-olive-300 text-sm font-medium transition-colors"
            >
              View All →
            </button>
          </div>

          {recentRequests.length === 0 ? (
            <div className="text-center py-12">
              <Truck className="w-16 h-16 text-military-600 mx-auto mb-4" />
              <p className="text-military-400 mb-4">No maintenance requests yet</p>
              <button
                onClick={() => navigate('/dashboard/vehicle-manager/create')}
                className="btn-primary"
              >
                Create Your First Request
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-military-700">
                    <th className="table-header text-left py-3 px-4">Vehicle</th>
                    <th className="table-header text-left py-3 px-4">Description</th>
                    <th className="table-header text-left py-3 px-4">Status</th>
                    <th className="table-header text-left py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRequests.map((request) => (
                    <tr 
                      key={request._id} 
                      className="table-row cursor-pointer"
                      onClick={() => navigate(`/dashboard/vehicle-manager/requests/${request._id}`)}
                    >
                      <td className="py-4 px-4 text-military-100 font-medium">
                        {request.vehicle?.name || 'N/A'}
                      </td>
                      <td className="py-4 px-4 text-military-300">
                        {request.description.substring(0, 50)}...
                      </td>
                      <td className="py-4 px-4">
                        {getStatusBadge(request)}
                      </td>
                      <td className="py-4 px-4 text-military-400 text-sm">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default VehicleManagerDashboard;