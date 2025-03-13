import { useState, useEffect } from 'react';

const Opportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    status: 'open',
    requiredSkills: '',
    duration: '',
  });

  useEffect(() => {
    // For demo purposes - replace with actual API calls
    setOpportunities([
      {
        id: 1,
        title: 'Community Garden Project',
        description: 'Help maintain and grow our community garden',
        location: 'Central Park',
        date: '2024-04-01',
        status: 'open',
        requiredSkills: 'Gardening, Physical work',
        duration: '3 months',
      },
      {
        id: 2,
        title: 'Youth Mentoring Program',
        description: 'Mentor high school students in academic subjects',
        location: 'Local High School',
        date: '2024-03-25',
        status: 'closed',
        requiredSkills: 'Teaching, Patience',
        duration: '6 months',
      },
    ]);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedOpportunity) {
      // Update existing opportunity
      setOpportunities(opportunities.map(opp => 
        opp.id === selectedOpportunity.id ? { ...opp, ...formData } : opp
      ));
    } else {
      // Add new opportunity
      setOpportunities([...opportunities, { id: Date.now(), ...formData }]);
    }
    handleCloseModal();
  };

  const handleDelete = (oppId) => {
    if (window.confirm('Are you sure you want to delete this opportunity?')) {
      setOpportunities(opportunities.filter(opp => opp.id !== oppId));
    }
  };

  const handleEdit = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setFormData(opportunity);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOpportunity(null);
    setFormData({
      title: '',
      description: '',
      location: '',
      date: '',
      status: 'open',
      requiredSkills: '',
      duration: '',
    });
  };

  const handleStatusChange = (oppId, newStatus) => {
    setOpportunities(opportunities.map(opp =>
      opp.id === oppId ? { ...opp, status: newStatus } : opp
    ));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Opportunities</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Create Opportunity
        </button>
      </div>

      {/* Opportunities List */}
      <div className="grid gap-6">
        {opportunities.map((opportunity) => (
          <div key={opportunity.id} className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{opportunity.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{opportunity.description}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                opportunity.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {opportunity.status}
              </span>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-500">Location:</span>
                <span className="ml-2 text-gray-900">{opportunity.location}</span>
              </div>
              <div>
                <span className="font-medium text-gray-500">Date:</span>
                <span className="ml-2 text-gray-900">{opportunity.date}</span>
              </div>
              <div>
                <span className="font-medium text-gray-500">Duration:</span>
                <span className="ml-2 text-gray-900">{opportunity.duration}</span>
              </div>
              <div>
                <span className="font-medium text-gray-500">Required Skills:</span>
                <span className="ml-2 text-gray-900">{opportunity.requiredSkills}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => handleStatusChange(opportunity.id, opportunity.status === 'open' ? 'closed' : 'open')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  opportunity.status === 'open'
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {opportunity.status === 'open' ? 'Close' : 'Reopen'}
              </button>
              <button
                onClick={() => handleEdit(opportunity)}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(opportunity.id)}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm font-medium hover:bg-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Opportunity Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {selectedOpportunity ? 'Edit Opportunity' : 'Create Opportunity'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Required Skills</label>
                <input
                  type="text"
                  value={formData.requiredSkills}
                  onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Duration</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  {selectedOpportunity ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Opportunities; 