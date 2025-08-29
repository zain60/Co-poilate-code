import React, { useEffect, useState } from 'react';
import SettingsLayout from '../../../layout/SettingsLayout';
import { listPurchasedNumbers } from '../../../services/twilio';
import { createCampaign, listCampaigns } from '../../../services/campaign';

const Campaigns = () => {
  const [tab, setTab] = useState('list'); // 'list' | 'create'
  const [purchased, setPurchased] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  async function loadPurchased() {
    try {
      const resp = await listPurchasedNumbers();
      if (resp?.success) setPurchased(resp.data || []);
    } catch {}
  }

  async function loadCampaigns() {
    try {
      const resp = await listCampaigns();
      if (resp?.success) setCampaigns(resp.data || []);
    } catch {}
  }

  useEffect(() => {
    loadPurchased();
    loadCampaigns();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const resp = await createCampaign({ name, phoneNumber });
      if (resp?.success) {
        setMessage('Campaign created successfully');
        setName('');
        setPhoneNumber('');
        loadCampaigns();
        setTab('list');
      } else {
        setError(resp?.message || 'Failed to create campaign');
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SettingsLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Campaigns</h2>
            <p className="text-sm text-gray-600 mt-1">Create campaigns by linking purchased numbers with your latest assistant.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className={`btn ${tab==='list' ? 'btn-primary' : ''}`} onClick={() => setTab('list')}>List</button>
            <button className={`btn ${tab==='create' ? 'btn-primary' : ''}`} onClick={() => setTab('create')}>Create</button>
          </div>
        </div>

        {error && <div className="text-red-600 mb-3">{error}</div>}
        {message && <div className="text-green-600 mb-3">{message}</div>}

        {tab === 'list' ? (
          <div className="bg-white rounded-lg shadow border border-gray-100">
            <div className="px-5 py-4 border-b">
              <h3 className="text-base font-medium text-gray-900">Existing Campaigns</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-5 text-xs font-semibold text-gray-600">Name</th>
                    <th className="py-2 px-5 text-xs font-semibold text-gray-600">Phone Number</th>
                    <th className="py-2 px-5 text-xs font-semibold text-gray-600">Assistant ID</th>
                    <th className="py-2 px-5 text-xs font-semibold text-gray-600">Vapi Number ID</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns?.length === 0 && (
                    <tr>
                      <td className="py-6 px-5 text-sm text-gray-500" colSpan={4}>No campaigns</td>
                    </tr>
                  )}
                  {campaigns?.map((c) => (
                    <tr key={c.id} className="border-b">
                      <td className="py-3 px-5">{c.name}</td>
                      <td className="py-3 px-5">{c.phoneNumber}</td>
                      <td className="py-3 px-5">{c.assistantId}</td>
                      <td className="py-3 px-5">{c.vapiNumberId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow border border-gray-100">
            <div className="px-5 py-4 border-b">
              <h3 className="text-base font-medium text-gray-900">Create Campaign</h3>
            </div>
            <form className="px-5 py-5 space-y-4" onSubmit={handleCreate}>
              <div>
                <label className="fs-12 text-[#667085] mb-1 block">Name</label>
                <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Campaign name" required />
              </div>
              <div>
                <label className="fs-12 text-[#667085] mb-1 block">Phone Number</label>
                <select className="input" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required>
                  <option value="">Select number</option>
                  {purchased.map(p => (
                    <option key={p.id} value={p.phoneNumber}>{p.phoneNumber}</option>
                  ))}
                </select>
                <p className="text-[11px] text-gray-500 mt-1">Assistant ID and Twilio credentials are resolved server-side.</p>
              </div>
              <div className="pt-1 flex items-center gap-3">
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Creating…' : 'Create Campaign'}</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </SettingsLayout>
  );
};

export default Campaigns;


