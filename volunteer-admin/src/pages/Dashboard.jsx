import { useState, useEffect } from 'react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOpportunities: 0,
    activeVolunteers: 0,
    pendingApplications: 0,
  });

  useEffect(() => {
    // For demo purposes - replace with actual API calls
    setStats({
      totalUsers: 150,
      totalOpportunities: 45,
      activeVolunteers: 89,
      pendingApplications: 12,
    });
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900">Total Users</h3>
              <p className="text-3xl font-semibold text-indigo-600">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        {/* Total Opportunities Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900">Total Opportunities</h3>
              <p className="text-3xl font-semibold text-green-600">{stats.totalOpportunities}</p>
            </div>
          </div>
        </div>

        {/* Active Volunteers Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900">Active Volunteers</h3>
              <p className="text-3xl font-semibold text-blue-600">{stats.activeVolunteers}</p>
            </div>
          </div>
        </div>

        {/* Pending Applications Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900">Pending Applications</h3>
              <p className="text-3xl font-semibold text-yellow-600">{stats.pendingApplications}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <p className="text-gray-500 text-sm">No recent activity to display.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 