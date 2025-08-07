import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaCalendarAlt, FaBuilding, FaUsers, FaSearch, FaClock, FaPlus, FaEdit, FaTrash, FaHourglassHalf, FaMapPin, FaCheckCircle, FaTimesCircle, FaUserCheck } from 'react-icons/fa';
import axios from 'axios';
import PostOpportunityModal from '../components/PostOpportunityModal';

const Opportunities = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddressDetails, setShowAddressDetails] = useState({});

  // Categories array
  const categories = ['All', 'Environment', 'Education', 'Healthcare', 'Community', 'Animal Welfare'];

  // Status options
  const statusOptions = ['All', 'Open', 'Filled', 'Completed', 'Canceled'];

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
        console.log('Attempting to fetch opportunities...');
        const response = await axios.get('https://volunteer-backend-egrn.onrender.com/api/opportunities');
        console.log('Response received:', response);
        if (response.data && Array.isArray(response.data)) {
          setOpportunities(response.data);
          setError(null);
        } else {
          setError('Received unexpected data format from server');
          console.error('Unexpected data format:', response.data);
        }
      } catch (err) {
        console.error('Error fetching opportunities:', err);
        setError(`Failed to load opportunities: ${err.message}`);
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

  // Handle status filter
  const handleStatusChange = (status) => {
    setSelectedStatus(status);
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
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('User ID not found. Please log in again.');
        return;
      }

      if (isEditing) {
        // Update existing opportunity
        const response = await axios.put(
          `https://volunteer-backend-egrn.onrender.com/api/opportunities/${opportunityData._id}`,
          { ...opportunityData, requesterId: userId }
        );
        
        if (response.data) {
          setOpportunities(opportunities.map(opp => 
            opp._id === opportunityData._id ? response.data : opp
          ));
          setError(null);
        }
      } else {
        // Create new opportunity
        const formData = new FormData();
        
        // Add all fields to formData
        Object.keys(opportunityData).forEach(key => {
          if (opportunityData[key] !== undefined) {
            formData.append(key, opportunityData[key]);
          }
        });
        
        // Add creator ID
        formData.append('createdBy', userId);
        
        const response = await axios.post('https://volunteer-backend-egrn.onrender.com/api/opportunities', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        if (response.data) {
          setOpportunities([...opportunities, response.data]);
          setError(null);
        }
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error handling opportunity submission:', err);
      setError(`Failed to save opportunity: ${err.response?.data?.error || err.message}`);
    }
  };

  // Delete opportunity
  const handleDeleteOpportunity = async (id) => {
    if (window.confirm('Are you sure you want to delete this opportunity?')) {
      try {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem("token");
        if (!userId) {
          setError('User ID not found. Please log in again.');
          return;

        }
        
        await axios.delete(`https://volunteer-backend-egrn.onrender.com/api/admin/opportunities/${id}`, {
          data: { requesterId: userId },
          headers:{
            Authorization:`Bearer ${token}`
          }
        });
        
        setOpportunities(opportunities.filter(opp => opp._id !== id));
        setError(null);
      } catch (err) {
        console.error('Error deleting opportunity:', err);
        setError(`Failed to delete opportunity: ${err.response?.data?.error || err.message}`);
      }
    }
  };

  // Cancel opportunity
  const handleCancelOpportunity = async (id) => {
    if (window.confirm('Are you sure you want to cancel this opportunity?')) {
      try {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem("token");

        if (!userId) {
          setError('User ID not found. Please log in again.');
          return;
        }
        
        await axios.put(`https://volunteer-backend-egrn.onrender.com/api/admin/opportunities/
          ${id}/cancel`, {
          requesterId: userId, headers:{
            Authorization:`Bearer ${token}`
          }
        });
        
        // Update the opportunity in the state
        setOpportunities(opportunities.map(opp => 
          opp._id === id ? { ...opp, status: 'Canceled' } : opp
        ));
        setError(null);
      } catch (err) {
        console.error('Error canceling opportunity:', err);
        setError(`Failed to cancel opportunity: ${err.response?.data?.error || err.message}`);
      }
    }
  };

  // Retry loading opportunities
  const handleRetryLoading = () => {
    window.location.reload();
  };

  // Filter opportunities based on search, category, district, and status
  const filteredOpportunities = opportunities.filter(opportunity => {
    const matchesSearch = opportunity.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          opportunity.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          opportunity.organization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          opportunity.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || opportunity.category === selectedCategory;
    
    const matchesDistrict = selectedDistrict === 'All' || 
                            (opportunity.address && opportunity.address.district === selectedDistrict);
    
    const matchesStatus = selectedStatus === 'All' || opportunity.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesDistrict && matchesStatus;
  });

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
      return dateString;
    }
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

  // Check if opportunity date has passed
  const isOpportunityPassed = (dateString) => {
    if (!dateString) return false;
    
    try {
      const currentDate = new Date();
      const opportunityDate = new Date(dateString);
      return currentDate > opportunityDate;
    } catch (e) {
      return false;
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Open':
        return 'bg-green-100 text-green-800';
      case 'Filled':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-gray-100 text-gray-800';
      case 'Canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
              
              <div className="w-full sm:w-auto">
                <select
                  value={selectedStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
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
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            <h3 className="font-bold">Error Loading Opportunities</h3>
            <p>{error}</p>
            <button 
              onClick={handleRetryLoading} 
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        ) : filteredOpportunities.length === 0 ? (
          <div className="bg-yellow-50 p-6 rounded-lg text-center">
            <p className="text-lg text-gray-600">No opportunities found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOpportunities.map((opportunity) => (
              <div key={opportunity._id} className={`bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-200 ${opportunity.status === 'Completed' ? 'opacity-75' : ''}`}>
                {opportunity.imageUrl && (
                  <div className="w-full h-48 overflow-hidden relative">
                    <img 
                      src={opportunity.imageUrl} 
                      alt={opportunity.title} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/400x200?text=Image+Not+Available';
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(opportunity.status)}`}>
                        {opportunity.status}
                      </span>
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{opportunity.title}</h3>
                    <div className="flex space-x-2">
                      {opportunity.status !== 'Completed' && opportunity.status !== 'Canceled' && (
                        <>
                          <button 
                            onClick={() => handleEditOpportunity(opportunity)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit opportunity"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            onClick={() => handleCancelOpportunity(opportunity._id)}
                            className="text-yellow-600 hover:text-yellow-800"
                            title="Cancel opportunity"
                          >
                            <FaTimesCircle />
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => handleDeleteOpportunity(opportunity._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete opportunity"
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
                    <span className={isOpportunityPassed(opportunity.date) ? 'line-through' : ''}>
                      {formatDate(opportunity.date)}
                    </span>
                    {isOpportunityPassed(opportunity.date) && (
                      <span className="ml-2 text-xs text-gray-500">(Past)</span>
                    )}
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
                    <span>{opportunity.volunteers || 0} volunteers needed</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-2">
                    <FaUserCheck className="mr-2 text-teal-500" />
                    <span>{opportunity.appliedVolunteers || 0} volunteers confirmed</span>
                    {opportunity.appliedVolunteers >= opportunity.volunteers && (
                      <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Filled
                      </span>
                    )}
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
          initialData={editingData}
          isEditing={isEditing}
          categories={categories.filter(cat => cat !== 'All')}
          districts={tnDistricts.filter(district => district !== 'All')}
        />
      )}
    </div>
  );
};

export default Opportunities;