import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { maintenanceAPI, vehicleAPI, handleAPIError } from '../../utils/api';
import { 
  Save, 
  ArrowLeft, 
  Plus, 
  Trash2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const CreateRequest = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    vehicle: '',
    description: '',
    currentState: '',
    requiredParts: [''],
    estimatedBill: '',
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await vehicleAPI.getAll();
      setVehicles(response.data);
    } catch (error) {
      console.error('Error fetching vehicles:', handleAPIError(error));
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePartChange = (index, value) => {
    const newParts = [...formData.requiredParts];
    newParts[index] = value;
    setFormData({ ...formData, requiredParts: newParts });
  };

  const addPart = () => {
    setFormData({
      ...formData,
      requiredParts: [...formData.requiredParts, ''],
    });
  };

  const removePart = (index) => {
    if (formData.requiredParts.length > 1) {
      const newParts = formData.requiredParts.filter((_, i) => i !== index);
      setFormData({ ...formData, requiredParts: newParts });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      // Filter out empty parts
      const filteredParts = formData.requiredParts.filter(part => part.trim() !== '');
      
      const requestData = {
        ...formData,
        requiredParts: filteredParts,
        estimatedBill: parseFloat(formData.estimatedBill),
      };

      await maintenanceAPI.create(requestData);
      setSuccess(true);
      
      // Reset form
      setFormData({
        vehicle: '',
        description: '',
        currentState: '',
        requiredParts: [''],
        estimatedBill: '',
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/dashboard/vehicle-manager/requests');
      }, 2000);
    } catch (err) {
      setError(handleAPIError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard/vehicle-manager')}
            className="p-2 hover:bg-military-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-military-300" />
          </button>
          <div>
            <h1 className="text-3xl font-display font-bold text-military-100">
              Create Maintenance Request
            </h1>
            <p className="text-military-400 mt-1">
              Submit a new vehicle maintenance request
            </p>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="card p-4 bg-green-500/10 border-green-500/30 animate-slide-in">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <p className="text-green-300">
                Request created successfully! Redirecting...
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="card p-4 bg-red-500/10 border-red-500/30 animate-slide-in">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-300">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="card p-8 space-y-6">
          {/* Vehicle Selection */}
          <div>
            <label className="label-field">
              Select Vehicle *
            </label>
            <select
              name="vehicle"
              value={formData.vehicle}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="">Choose a vehicle...</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle._id} value={vehicle._id}>
                  {vehicle.name} - Class {vehicle.vehicleClass} ({vehicle.status})
                </option>
              ))}
            </select>
          </div>

          {/* Fault Description */}
          <div>
            <label className="label-field">
              Fault Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input-field h-32 resize-none"
              placeholder="Describe the fault or issue in detail..."
              required
            />
          </div>

          {/* Current Vehicle Condition */}
          <div>
            <label className="label-field">
              Current Vehicle Condition *
            </label>
            <textarea
              name="currentState"
              value={formData.currentState}
              onChange={handleChange}
              className="input-field h-24 resize-none"
              placeholder="Describe the current state of the vehicle..."
              required
            />
          </div>

          {/* Required Parts */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="label-field mb-0">
                Required Parts *
              </label>
              <button
                type="button"
                onClick={addPart}
                className="text-olive-400 hover:text-olive-300 text-sm font-medium flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Part
              </button>
            </div>
            <div className="space-y-3">
              {formData.requiredParts.map((part, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={part}
                    onChange={(e) => handlePartChange(index, e.target.value)}
                    className="input-field flex-1"
                    placeholder={`Part ${index + 1}`}
                    required
                  />
                  {formData.requiredParts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePart(index)}
                      className="p-2.5 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Estimated Bill */}
          <div>
            <label className="label-field">
              Estimated Bill (₹) *
            </label>
            <input
              type="number"
              name="estimatedBill"
              value={formData.estimatedBill}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter estimated cost"
              min="0"
              step="0.01"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Submit Request
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard/vehicle-manager')}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreateRequest;