import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOpportunities: 0,
    activeVolunteers: 0,
    pendingApplications: 0,
    completedOpportunities: 0,
    totalHours: 0,
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingOpportunities, setUpcomingOpportunities] = useState([]);
  const [volunteerData, setVolunteerData] = useState([]);
  const [opportunityData, setOpportunityData] = useState([]);

  useEffect(() => {
    // For demo purposes - replace with actual API calls
    setStats({
      totalUsers: 150,
      totalOpportunities: 45,
      activeVolunteers: 89,
      pendingApplications: 12,
      completedOpportunities: 32,
      totalHours: 1240,
    });

    setRecentActivities([
      { id: 1, type: 'new_volunteer', user: 'Sarah Johnson', action: 'joined as a volunteer', time: '2 hours ago' },
      { id: 2, type: 'opportunity_completed', user: 'Mike Smith', action: 'completed Community Garden Project', time: '4 hours ago' },
      { id: 3, type: 'new_opportunity', user: 'Admin', action: 'created new opportunity: Youth Mentoring', time: '1 day ago' },
      { id: 4, type: 'application', user: 'Emily Brown', action: 'applied for Teaching Assistant role', time: '1 day ago' },
      { id: 5, type: 'completion', user: 'John Doe', action: 'completed 10 volunteer hours', time: '2 days ago' },
    ]);

    setUpcomingOpportunities([
      { id: 1, title: 'Community Garden Project', date: '2024-04-01', volunteers: 5, required: 8 },
      { id: 2, title: 'Senior Center Visit', date: '2024-04-05', volunteers: 3, required: 6 },
      { id: 3, title: 'Food Bank Distribution', date: '2024-04-10', volunteers: 8, required: 10 },
    ]);

    setVolunteerData([
      { month: 'Jan', volunteers: 65 },
      { month: 'Feb', volunteers: 78 },
      { month: 'Mar', volunteers: 89 },
      { month: 'Apr', volunteers: 94 },
      { month: 'May', volunteers: 105 },
      { month: 'Jun', volunteers: 112 },
    ]);

    setOpportunityData([
      { name: 'Education', completed: 25, active: 15 },
      { name: 'Environment', completed: 18, active: 12 },
      { name: 'Healthcare', completed: 15, active: 8 },
      { name: 'Community', completed: 22, active: 10 },
    ]);
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'new_volunteer':
        return '👤';
      case 'opportunity_completed':
        return '✅';
      case 'new_opportunity':
        return '🆕';
      case 'application':
        return '📝';
      case 'completion':
        return '🎉';
      default:
        return '📌';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h2>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            Generate Report
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            New Opportunity
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col">
            <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
            <p className="text-3xl font-semibold text-indigo-600">{stats.totalUsers}</p>
            <span className="text-xs text-green-600 mt-2">↑ 12% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col">
            <h3 className="text-sm font-medium text-gray-500">Active Volunteers</h3>
            <p className="text-3xl font-semibold text-green-600">{stats.activeVolunteers}</p>
            <span className="text-xs text-green-600 mt-2">↑ 8% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col">
            <h3 className="text-sm font-medium text-gray-500">Total Opportunities</h3>
            <p className="text-3xl font-semibold text-blue-600">{stats.totalOpportunities}</p>
            <span className="text-xs text-green-600 mt-2">↑ 15% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col">
            <h3 className="text-sm font-medium text-gray-500">Pending Applications</h3>
            <p className="text-3xl font-semibold text-yellow-600">{stats.pendingApplications}</p>
            <span className="text-xs text-yellow-600 mt-2">Needs attention</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col">
            <h3 className="text-sm font-medium text-gray-500">Completed</h3>
            <p className="text-3xl font-semibold text-purple-600">{stats.completedOpportunities}</p>
            <span className="text-xs text-green-600 mt-2">On track</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col">
            <h3 className="text-sm font-medium text-gray-500">Total Hours</h3>
            <p className="text-3xl font-semibold text-pink-600">{stats.totalHours}</p>
            <span className="text-xs text-green-600 mt-2">↑ 20% from last month</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Volunteer Growth Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Volunteer Growth</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volunteerData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="volunteers" stroke="#4f46e5" fill="#818cf8" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Opportunities by Category */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Opportunities by Category</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={opportunityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" stackId="a" fill="#818cf8" />
                <Bar dataKey="active" stackId="a" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
            <div className="flow-root">
              <ul className="-mb-8">
                {recentActivities.map((activity, activityIdx) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {activityIdx !== recentActivities.length - 1 ? (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                          <span className="text-lg">{getActivityIcon(activity.type)}</span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium text-gray-900">{activity.user}</span> {activity.action}
                            </p>
                          </div>
                          <div className="whitespace-nowrap text-right text-sm text-gray-500">
                            {activity.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Upcoming Opportunities */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Opportunities</h3>
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Opportunity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {upcomingOpportunities.map((opportunity) => (
                    <tr key={opportunity.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {opportunity.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(opportunity.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          opportunity.volunteers >= opportunity.required
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {opportunity.volunteers}/{opportunity.required} volunteers
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 