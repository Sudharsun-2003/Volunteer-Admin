import React, { useState, useEffect } from 'react';
import { FaTimes, FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';

const PostOpportunityModal = ({ isOpen, onClose, onSubmit, initialData, isEditing }) => {
  const initialFormState = {
    title: '',
    organization: '',
    description: '',
    location: '',
    address: {
      street: '',
      city: '',
      district: '',
      pincode: '',
      state: 'Tamil Nadu'
    },
    date: '',
    start_time: '',
    end_time: '',
    duration: '',
    volunteers: '',
    category: 'Community',
    skills: '',
    impact: '',
    image: null
  };

  const [formData, setFormData] = useState(initialFormState);
  const [imagePreview, setImagePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Tamil Nadu districts
  const tnDistricts = [
    'Ariyalur', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul', 
    'Erode', 'Kanchipuram', 'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai', 
    'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai', 
    'Ramanathapuram', 'Salem', 'Sivaganga', 'Thanjavur', 'Theni', 'Thoothukudi', 
    'Tiruchirappalli', 'Tirunelveli', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 
    'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar'
  ];

  // Categories array
  const categories = ['Environment', 'Education', 'Healthcare', 'Community', 'Animal Welfare'];

  // Admin user ID - replace with your actual admin user ID from MongoDB
  const adminUserId = "65604adfe27cb748c7720c4e";

  useEffect(() => {
    if (initialData && isEditing) {
      // Format the date for the input field (YYYY-MM-DD)
      const formattedDate = initialData.date 
        ? new Date(initialData.date).toISOString().split('T')[0]
        : '';
        
      // Ensure address object exists with all required properties
      const addressData = initialData.address || {
        street: '',
        city: '',
        district: '',
        pincode: '',
        state: 'Tamil Nadu'
      };
      
      setFormData({
        ...initialData,
        date: formattedDate,
        address: addressData,
        image: null // We don't want to pre-fill the file input
      });
      
      // Set image preview if available
      if (initialData.imageUrl) {
        setImagePreview(initialData.imageUrl);
      }
    } else {
      // Reset form when not editing
      setFormData(initialFormState);
      setImagePreview('');
    }
  }, [initialData, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested address fields
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      // Add the admin user ID as the creator
      const submissionData = {
        ...formData,
        createdBy: adminUserId
      };

      if (isEditing) {
        // Add the requesterId for authorization
        submissionData.requesterId = adminUserId;

        // If editing, check if we need to update the image
        if (formData.image) {
          // Create a new FormData object for the image upload
          const imageFormData = new FormData();
          imageFormData.append('image', formData.image);
          
          // Upload the new image
          const imageResponse = await axios.post(
            'http://localhost:5001/api/upload', 
            imageFormData
          );
          
          // Get the new image URL
          const newImageUrl = imageResponse.data.url;
          
          // Update the opportunity with the new image URL
          const updatedOpportunity = {
            ...submissionData,
            imageUrl: newImageUrl
          };
          
          const response = await axios.put(
            `http://localhost:5001/api/opportunities/${formData._id}`,
            updatedOpportunity
          );
          
          onSubmit(response.data);
        } else {
          // If no new image, just update the other fields
          const response = await axios.put(
            `http://localhost:5001/api/opportunities/${formData._id}`,
            submissionData
          );
          
          onSubmit(response.data);
        }
      } else {
        // If creating a new opportunity
        const newOpportunityData = new FormData();
        
        // Append admin user ID for createdBy
        newOpportunityData.append('createdBy', adminUserId);
        
        // Append all form fields to the FormData
        Object.keys(formData).forEach(key => {
          if (key === 'image' && formData[key]) {
            newOpportunityData.append(key, formData[key]);
          } else if (key === 'address') {
            // Handle nested address object
            Object.keys(formData.address).forEach(addressKey => {
              newOpportunityData.append(`address[${addressKey}]`, formData.address[addressKey]);
            });
          } else if (key !== 'image') {
            newOpportunityData.append(key, formData[key]);
          }
        });
        
        // Make the API call
        const response = await axios.post(
          'http://localhost:5001/api/opportunities',
          newOpportunityData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        
        // Call the onSubmit function with the new opportunity
        onSubmit(response.data);
        
        // Reset form
        setFormData(initialFormState);
        setImagePreview('');
      }
      
      // Close the modal
      onClose();
    } catch (err) {
      console.error('Error submitting opportunity:', err);
      setError(err.response?.data?.error || 'Failed to submit opportunity. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Opportunity' : 'Post New Opportunity'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <FaTimes size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Beach Cleanup Event"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization *
              </label>
              <input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Green Earth Foundation"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the opportunity in detail..."
              ></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                General Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Marina Beach, Chennai"
              />
            </div>
            
            {/* Address Fields */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-800 mb-2 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-blue-600" />
                Detailed Address (Tamil Nadu)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 123 Gandhi Street"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City/Town *
                  </label>
                  <input
                    type="text"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Chennai"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    District *
                  </label>
                  <select
                    name="address.district"
                    value={formData.address.district}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select District</option>
                    {tnDistricts.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="address.pincode"
                    value={formData.address.pincode}
                    onChange={handleChange}
                    required
                    pattern="[0-9]{6}"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 600001"
                  />
                  <p className="text-xs text-gray-500 mt-1">6-digit pincode</p>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleChange}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                  />
                  <p className="text-xs text-gray-500 mt-1">Default: Tamil Nadu</p>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time *
              </label>
              <input
                type="time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time *
              </label>
              <input
                type="time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (hours) *
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                min="0.25"
                step="0.25"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 3.5"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Volunteers Needed *
              </label>
              <input
                type="number"
                name="volunteers"
                value={formData.volunteers}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 10"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Required Skills (comma-separated) *
              </label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Teaching, Cleaning, First Aid"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Impact Description *
              </label>
              <textarea
                name="impact"
                value={formData.impact}
                onChange={handleChange}
                required
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the impact this opportunity will have..."
              ></textarea>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image *
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required={!isEditing}
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload an image that represents the opportunity (max 5MB)
              </p>
              
              {imagePreview && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700 mb-1">Preview:</p>
                  <img 
                    src={imagePreview} 
                    alt="Opportunity preview" 
                    className="h-40 object-cover rounded-lg border border-gray-300"
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors duration-200 flex items-center"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                isEditing ? 'Update Opportunity' : 'Create Opportunity'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostOpportunityModal;