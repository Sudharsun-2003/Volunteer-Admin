import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaCalendarAlt, FaBuilding, FaUsers, FaSearch, FaClock, FaHeart, FaPlus, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import PostOpportunityModal from '../components/PostOpportunityModal';

const Opportunities = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const categories = ['All', 'Environment', 'Education', 'Healthcare', 'Community', 'Animal Welfare'];

  // Fetch opportunities from API
  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/opportunities');
        setOpportunities(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching opportunities:', err);
        setError('Failed to load opportunities. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  const handleAddOpportunity = (newOpportunity) => {
    setOpportunities([...opportunities, newOpportunity]);
  };

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || opp.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="bg-white">
        <div className="max-w-7xl mx-auto py-8 px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                Volunteer Opportunities
              </h1>
              <p className="mt-2 text-gray-600 max-w-3xl">
                Make a difference in your community by joining these meaningful volunteer opportunities.
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              <FaPlus className="mr-2" />
              Post Opportunity
            </button>
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search opportunities..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading opportunities...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-red-500 mb-4">
              <FaTimes size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Error</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        ) : filteredOpportunities.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FaSearch size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No opportunities found</h3>
            <p className="text-gray-600">
              Try adjusting your search or filters to find more opportunities.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {filteredOpportunities.map((opportunity) => (
              <div 
                key={opportunity._id} 
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 h-64 relative group">
                    <img
                      src={opportunity.imageUrl}
                      alt={opportunity.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-4 left-4">
                      <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-50 text-blue-700 rounded-full shadow-sm">
                        {opportunity.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-8 md:w-2/3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{opportunity.title}</h2>
                        <div className="flex items-center text-gray-700 mb-4">
                          <FaBuilding className="mr-2" />
                          <span className="font-medium">{opportunity.organization}</span>
                        </div>
                      </div>
                      <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md">
                        Apply Now
                      </button>
                    </div>

                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {opportunity.description}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-gray-100">
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="text-gray-400 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Location</p>
                          <p className="text-gray-900">{opportunity.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <FaCalendarAlt className="text-gray-400 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Date</p>
                          <p className="text-gray-900">{formatDate(opportunity.date)}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <FaClock className="text-gray-400 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Time</p>
                          <p className="text-gray-900">{opportunity.start_time} - {opportunity.end_time}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <FaUsers className="text-gray-400 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Volunteers Needed</p>
                          <p className="text-gray-900">{opportunity.volunteers}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <div className="mb-4">
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Required Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {opportunity.skills.split(',').map((skill, index) => (
                            <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors duration-200">
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                      {opportunity.impact && (
                        <div className="flex items-center">
                          <FaHeart className="text-red-400 mr-2" />
                          <p className="text-sm text-gray-700">{opportunity.impact}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <PostOpportunityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddOpportunity}
      />
    </div>
  );
};

export default Opportunities;