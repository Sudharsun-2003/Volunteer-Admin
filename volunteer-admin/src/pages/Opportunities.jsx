import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaCalendarAlt, FaBuilding, FaUsers, FaSearch, FaClock, FaPlus, FaEdit, FaTrash, FaHourglassHalf, FaMapPin } from 'react-icons/fa';
import axios from 'axios';
import PostOpportunityModal from '../components/PostOpportunityModal';

const Opportunities = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddressDetails, setShowAddressDetails] = useState({});

  // Categories array
  const categories = ['All', 'Environment', 'Education', 'Healthcare', 'Community', 'Animal Welfare'];

  // Tamil Nadu districts for filtering
  const tnDistricts = [
    'All', 'Ariyalur', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul', 
    'Erode', 'Kanchipuram', 'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai', 
    'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai', 
    'Ramanathapuram', 'Salem', 'Sivaganga', 'Thanjavur', 'Theni', 'Thoothukudi', 
    'Tiruchirappalli', 'Tirunelveli', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 
    'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar'
  ];

  // Fetch opportunities
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

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle category filter
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Handle district filter
  const handleDistrictChange = (district) => {
    setSelectedDistrict(district);
  };

  // Toggle address details
  const toggleAddressDetails = (id) => {
    setShowAddressDetails(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Open modal for new opportunity
  const handleOpenModal = () => {
    setIsEditing(false);
    setEditingData(null);
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleEditOpportunity = (opportunity) => {
    setIsEditing(true);
    setEditingData(opportunity);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Handle opportunity submission
  const handleSubmitOpportunity = async (opportunityData) => {
    try {
      if (isEditing) {
        // Update existing opportunity
        const response = await axios.put(
          `http://localhost:5000/api/opportunities/${opportunityData._id}`,
          opportunityData
        );
        setOpportunities(opportunities.map(opp => 
          opp._id === opportunityData._id ? response.data : opp
        ));
      } else {
        // Add new opportunity to the list
        setOpportunities([...opportunities, opportunityData]);
      }
    } catch (err) {
      console.error('Error handling opportunity submission:', err);
      setError('Failed to save opportunity. Please try again.');
    }
  };

  // Delete opportunity
  const handleDeleteOpportunity = async (id) => {
    if (window.confirm('Are you sure you want to delete this opportunity?')) {
      try {
        await axios.delete(`http://localhost:5000/api/opportunities/${id}`);
        setOpportunities(opportunities.filter(opp => opp._id !== id));
      } catch (err) {
        console.error('Error deleting opportunity:', err);
        setError('Failed to delete opportunity. Please try again.');
      }
    }
  };

  // Filter opportunities based on search, category, and district
  const filteredOpportunities = opportunities.filter(opportunity => {
    const matchesSearch = opportunity.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          opportunity.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          opportunity.organization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          opportunity.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || opportunity.category === selectedCategory;
    
    const matchesDistrict = selectedDistrict === 'All' || 
                            (opportunity.address && opportunity.address.district === selectedDistrict);
    
    return matchesSearch && matchesCategory && matchesDistrict;
  });

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format time
  const formatTime = (timeString) => {
    if (!timeString) return '';
    
    try {
      // If it's already in HH:MM format, just return it
      if (timeString.includes(':')) return timeString;
      
      // Otherwise, try to format it
      const [hours, minutes] = timeString.split(':');
      return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    } catch (e) {
      return timeString;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Volunteer Opportunities</h1>
          
          <button
            onClick={handleOpenModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:bg-blue-700 transition-colors duration-200"
          >
            <FaPlus className="mr-2" />
            Post New Opportunity
          </button>
        </div>
        
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search opportunities..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-auto">
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="w-full sm:w-auto">
                <select
                  value={selectedDistrict}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  {tnDistricts.map((district) => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{error}</div>
        ) : filteredOpportunities.length === 0 ? (
          <div className="bg-yellow-50 p-6 rounded-lg text-center">
            <p className="text-lg text-gray-600">No opportunities found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOpportunities.map((opportunity) => (
              <div key={opportunity._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-200">
                {opportunity.imageUrl && (
                  <div className="w-full h-48 overflow-hidden">
                    <img 
                      src={opportunity.imageUrl} 
                      alt={opportunity.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{opportunity.title}</h3>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditOpportunity(opportunity)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => handleDeleteOpportunity(opportunity._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-2">
                    <FaBuilding className="mr-2 text-blue-500" />
                    <span>{opportunity.organization}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-2">
                    <FaMapMarkerAlt className="mr-2 text-green-500" />
                    <span>{opportunity.location}</span>
                    <button 
                      onClick={() => toggleAddressDetails(opportunity._id)} 
                      className="ml-2 text-xs text-blue-500 hover:underline"
                    >
                      {showAddressDetails[opportunity._id] ? 'Hide details' : 'Show details'}
                    </button>
                  </div>
                  
                  {showAddressDetails[opportunity._id] && opportunity.address && (
                    <div className="ml-6 mb-3 text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
                      <p><FaMapPin className="inline mr-1 text-gray-500" /> {opportunity.address.street}</p>
                      <p className="mt-1">{opportunity.address.city}, {opportunity.address.district}, {opportunity.address.pincode}</p>
                      {opportunity.address.state && <p className="mt-1">{opportunity.address.state}</p>}
                    </div>
                  )}
                  
                  <div className="flex items-center text-gray-600 mb-2">
                    <FaCalendarAlt className="mr-2 text-purple-500" />
                    <span>{formatDate(opportunity.date)}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-2">
                    <FaClock className="mr-2 text-orange-500" />
                    <span>
                      {opportunity.start_time && opportunity.end_time 
                        ? `${formatTime(opportunity.start_time)} - ${formatTime(opportunity.end_time)}`
                        : opportunity.time || 'Time not specified'}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-2">
                    <FaUsers className="mr-2 text-indigo-500" />
                    <span>{opportunity.volunteers || opportunity.volunteersNeeded || 0} volunteers needed</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-4">
                    <FaHourglassHalf className="mr-2 text-yellow-500" />
                    <span>{opportunity.duration} {opportunity.duration === "1" ? "hour" : "hours"}</span>
                  </div>
                  
                  <div className="mb-4">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {opportunity.category}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{opportunity.description}</p>
                  
                  {opportunity.skills && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-700 mb-1">Skills Required:</h4>
                      <div className="flex flex-wrap gap-1">
                        {opportunity.skills.split(',').map((skill, index) => (
                          <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {opportunity.impact && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-700 mb-1">Impact:</h4>
                      <p className="text-gray-600 text-sm">{opportunity.impact}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {isModalOpen && (
        <PostOpportunityModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmitOpportunity}
          editData={editingData}
          isEditing={isEditing}
          categories={categories.filter(cat => cat !== 'All')}
          districts={tnDistricts.filter(district => district !== 'All')}
        />
      )}
    </div>
  );
};

export default Opportunities;