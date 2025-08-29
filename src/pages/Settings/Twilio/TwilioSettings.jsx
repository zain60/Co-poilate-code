import React, { useEffect, useState } from 'react';
import SettingsLayout from '../../../layout/SettingsLayout';
import { getAvailableNumbers, purchaseNumber, listPurchasedNumbers } from '../../../services/twilio';

const TwilioSettings = () => {
  const [country, setCountry] = useState('CA');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState([]);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseMessage, setPurchaseMessage] = useState('');
  const [purchased, setPurchased] = useState([]);
  const [purchasedLoading, setPurchasedLoading] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  // Campaign creation moved to its own page

  async function loadPurchased() {
    setPurchasedLoading(true);
    try {
      const resp = await listPurchasedNumbers();
      if (resp?.success) setPurchased(resp.data || []);
    } catch {}
    setPurchasedLoading(false);
  }

  useEffect(() => {
    loadPurchased();
  }, []);

  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPurchaseMessage('');
    setResults([]);
    try {
      const resp = await getAvailableNumbers({ country });
      if (resp?.success) {
        setResults(resp.data || []);
      } else {
        setError(resp?.message || 'Failed to fetch numbers');
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to fetch numbers');
    } finally {
      setLoading(false);
    }
  }

  async function handlePurchase(phoneNumber) {
    setPurchaseLoading(true);
    setError('');
    setPurchaseMessage('');
    try {
      const resp = await purchaseNumber({ phoneNumber });
      if (resp?.success) {
        setPurchaseMessage('Purchased successfully: ' + (resp?.data?.twilio?.friendlyName || phoneNumber));
        handleSearch(new Event('submit'));
        loadPurchased();
      } else {
        setError(resp?.message || 'Failed to purchase number');
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to purchase number');
    } finally {
      setPurchaseLoading(false);
    }
  }

  return (
    <SettingsLayout>
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="fs-18 fw-600 text-blue-39">Twilio Numbers</p>
            <p className="text-sm text-gray-600">Manage your purchased numbers and search new numbers to buy.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn" onClick={loadPurchased} disabled={purchasedLoading}>
              {purchasedLoading ? 'Refreshing…' : 'Refresh'}
            </button>
            <button className="btn btn-primary" onClick={() => { setError(''); setPurchaseMessage(''); setResults([]); setShowSearchModal(true); }}>Search Numbers</button>
          </div>
        </div>

        {error && <div className="text-red-600 mb-3">{error}</div>}
        {purchaseMessage && <div className="text-green-600 mb-3">{purchaseMessage}</div>}

        <div className="flex items-center justify-between mb-2">
          <p className="fs-16 fw-600">Purchased Numbers</p>
        </div>

        {/* Campaign creation moved to /settings/campaigns */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">Number</th>
                <th className="py-2">Friendly Name</th>
                <th className="py-2">Country</th>
                <th className="py-2">SMS</th>
                <th className="py-2">Voice</th>
                <th className="py-2">MMS</th>
              </tr>
            </thead>
            <tbody>
              {purchased?.length === 0 && !purchasedLoading && (
                <tr>
                  <td className="py-3" colSpan={6}>No purchased numbers</td>
                </tr>
              )}
              {purchased?.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="py-3">{p.phoneNumber}</td>
                  <td className="py-3">{p.friendlyName || '-'}</td>
                  <td className="py-3">{p.country || '-'}</td>
                  <td className="py-3">{p.smsEnabled ? 'Yes' : 'No'}</td>
                  <td className="py-3">{p.voiceEnabled ? 'Yes' : 'No'}</td>
                  <td className="py-3">{p.mmsEnabled ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Search Numbers Modal */}
        {showSearchModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowSearchModal(false)}></div>
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4">
              <div className="px-5 py-4 border-b flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-gray-900">Search Numbers</h3>
                  <p className="text-xs text-gray-600 mt-1">Choose a country and search available phone numbers to purchase.</p>
                </div>
                <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowSearchModal(false)}>✕</button>
              </div>
              <div className="px-5 py-5">
                <form onSubmit={handleSearch} className="mb-4">
                  <div className="flex gap-4 items-end">
                    <div className="flex-1">
                      <label className="fs-12 text-[#667085] mb-1 block">Country</label>
                      <select className="input" value={country} onChange={(e) => setCountry(e.target.value)}>
                        <option value="CA">Canada</option>
                        <option value="GB">United Kingdom</option>
                      </select>
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? "Searching..." : "Search"}
                    </button>
                  </div>
                </form>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2">Number</th>
                        <th className="py-2">Friendly Name</th>
                        <th className="py-2">Capabilities</th>
                        <th className="py-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results?.length === 0 && !loading && (
                        <tr>
                          <td className="py-3" colSpan={4}>No results found</td>
                        </tr>
                      )}
                      {results?.map((n, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="py-3">{n?.phoneNumber || n?.phone_number || n?.friendlyName}</td>
                          <td className="py-3">{n?.friendlyName || "-"}</td>
                          <td className="py-3">
                            {n?.capabilities ? Object.keys(n.capabilities).filter(k => n.capabilities[k]).join(", ") : "-"}
                          </td>
                          <td className="py-3 align-middle whitespace-nowrap">
                            <div className="flex items-center justify-end w-full">
                              <button className="btn btn-primary" onClick={() => handlePurchase(n?.phoneNumber || n?.phone_number)} disabled={purchaseLoading}>
                                {purchaseLoading ? "Purchasing..." : "Purchase"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </SettingsLayout>
  );
};

export default TwilioSettings;
