import React, { useState, useEffect } from 'react';
import { X, Search, Plus } from 'lucide-react';
import { getAllProvider } from '../../../services/cases';
import { Button } from '../../../components/ui/Button';

const AddProviderModal = ({ isOpen, onClose, onSelectProvider }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        const data = await getAllProvider();
        setProviders(data);
      } catch (error) {
        console.error('Error fetching providers:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchProviders();
    }
  }, [isOpen]);

  const filteredProviders = providers.filter(provider =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectProvider = (provider) => {
    setSelectedProvider(provider);
  };

  const handleAddProvider = () => {
    if (selectedProvider) {
      onSelectProvider(selectedProvider);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium">Add Provider</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, specialty, or email"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          ) : filteredProviders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No providers found
            </div>
          ) : (
            <div className="space-y-2">
              {filteredProviders.map((provider) => (
                <div 
                  key={provider.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedProvider?.id === provider.id 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                  onClick={() => handleSelectProvider(provider)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">{provider.name}</h4>
                      <p className="text-sm text-gray-500">
                        {provider.specialty || 'No specialty specified'}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {provider.email}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddProvider}
            disabled={!selectedProvider}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Add Provider
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddProviderModal;