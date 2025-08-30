import React, { useState, useEffect } from 'react';
import SettingsLayout from '../../../layout/SettingsLayout';
import { listRecordings } from '../../../services/recording';

const Recordings = () => {
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false);
  const [currentSummary, setCurrentSummary] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage] = useState(10);
  const [sortOrder, setSortOrder] = useState('desc');
  const [sortBy, setSortBy] = useState('createdAt');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchRecordings = async (page = 1, search = '', sortedBy = sortBy, sortedOrder = sortOrder) => {
    setLoading(true);
    try {
      const response = await listRecordings({ page, perPage, sortBy: sortedBy, sortOrder: sortedOrder, search });
      if (response?.success) {
        setRecordings(response.data || []);
        setTotalPages(Math.ceil((response.total || 0) / perPage));
      } else {
        setError(response?.message || 'Failed to fetch recordings');
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to fetch recordings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecordings(currentPage, searchTerm, sortBy, sortOrder);
  }, [currentPage, searchTerm, sortBy, sortOrder]);

  const handleSort = (column) => {
    const newSortOrder = sortBy === column ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc';
    setSortBy(column);
    setSortOrder(newSortOrder);
    fetchRecordings(currentPage, searchTerm, column, newSortOrder);
  };

  const handlePlay = (audioUrl) => {
    if (audioUrl) {
      setCurrentAudio(audioUrl);
      setIsDialogOpen(true);
    }
  };

  const handleDownload = async (audioUrl, fileName) => {
    try {
      const response = await fetch(audioUrl);
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      setError('Download failed');
    }
  };

  const handleShowSummary = (summary) => {
    try {
      const parsed = JSON.parse(summary);
      setCurrentSummary(Array.isArray(parsed) ? parsed : [parsed]);
      setIsSummaryDialogOpen(true);
    } catch {
      setCurrentSummary([{ role: 'system', message: summary }]);
      setIsSummaryDialogOpen(true);
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SettingsLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Call Recordings</h2>
          <p className="text-sm text-gray-600 mt-1">View and manage your inbound call recordings and summaries.</p>
        </div>

        {error && <div className="text-red-600 mb-3">{error}</div>}

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search recordings..."
            className="w-full p-2 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-5 text-xs font-semibold text-gray-600">#</th>
                  <th className="py-2 px-5 text-xs font-semibold text-gray-600 cursor-pointer" onClick={() => handleSort('type')}>
                    Type
                  </th>
                  <th className="py-2 px-5 text-xs font-semibold text-gray-600 cursor-pointer" onClick={() => handleSort('from')}>
                    From
                  </th>
                  <th className="py-2 px-5 text-xs font-semibold text-gray-600 cursor-pointer" onClick={() => handleSort('to')}>
                    To
                  </th>
                  <th className="py-2 px-5 text-xs font-semibold text-gray-600 cursor-pointer" onClick={() => handleSort('createdAt')}>
                    Date
                  </th>
                  <th className="py-2 px-5 text-xs font-semibold text-gray-600 cursor-pointer" onClick={() => handleSort('duration')}>
                    Duration
                  </th>
                  <th className="py-2 px-5 text-xs font-semibold text-gray-600 cursor-pointer" onClick={() => handleSort('status')}>
                    Status
                  </th>
                  <th className="py-2 px-5 text-right text-xs font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="py-6 px-5 text-sm text-gray-500 text-center" colSpan={8}>Loading...</td>
                  </tr>
                ) : recordings?.length === 0 ? (
                  <tr>
                    <td className="py-6 px-5 text-sm text-gray-500 text-center" colSpan={8}>No recordings found</td>
                  </tr>
                ) : (
                  recordings.map((recording, index) => (
                    <tr key={recording.id} className="border-b hover:bg-gray-50/50">
                      <td className="py-3 px-5">{((currentPage - 1) * perPage) + index + 1}</td>
                      <td className="py-3 px-5">{recording.type}</td>
                      <td className="py-3 px-5">{recording.from || '-'}</td>
                      <td className="py-3 px-5">{recording.to || '-'}</td>
                      <td className="py-3 px-5">
                        {new Date(recording.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-5">{formatDuration(recording.duration)}</td>
                      <td className="py-3 px-5">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          recording.status === 'completed' ? 'bg-green-100 text-green-800' :
                          recording.status === 'missed-call' ? 'bg-red-100 text-red-800' :
                          recording.status === 'voice-mail' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {recording.status}
                        </span>
                      </td>
                      <td className="py-3 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {recording.recordingUrl && (
                            <>
                              <button
                                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                                onClick={() => handlePlay(recording.recordingUrl)}
                              >
                                ▶️ Play
                              </button>
                              <button
                                className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
                                onClick={() => handleDownload(recording.recordingUrl, `recording-${recording.id}.mp3`)}
                              >
                                ⬇️ Download
                              </button>
                            </>
                          )}
                          {recording.summary && (
                            <button
                              className="px-2 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-xs"
                              onClick={() => handleShowSummary(recording.summary)}
                            >
                              📋 Summary
                            </button>
                          )}
                          {recording.conversation && (
                            <button
                              className="px-2 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 text-xs"
                              onClick={() => handleShowSummary(recording.conversation)}
                            >
                              💬 Chat
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="btn disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="btn disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {/* Audio Player Modal */}
        {isDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setIsDialogOpen(false)}></div>
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
              <div className="px-5 py-4 border-b flex items-center justify-between">
                <h3 className="text-base font-medium text-gray-900">Play Recording</h3>
                <button className="text-gray-500 hover:text-gray-700" onClick={() => setIsDialogOpen(false)}>✕</button>
              </div>
              <div className="px-5 py-5">
                <audio controls className="w-full" src={currentAudio}>
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>
          </div>
        )}

        {/* Summary/Conversation Modal */}
        {isSummaryDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setIsSummaryDialogOpen(false)}></div>
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
              <div className="px-5 py-4 border-b flex items-center justify-between">
                <h3 className="text-base font-medium text-gray-900">Conversation Summary</h3>
                <button className="text-gray-500 hover:text-gray-700" onClick={() => setIsSummaryDialogOpen(false)}>✕</button>
              </div>
              <div className="px-5 py-5 space-y-4">
                {currentSummary.map((item, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg shadow-md ${
                      item.role === 'bot' ? 'bg-blue-50' : 'bg-green-50'
                    }`}
                  >
                    <p className="font-semibold text-lg mb-2">
                      {item.role === 'bot' ? 'Bot' : 'User'}
                    </p>
                    <p className="text-base">{item.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </SettingsLayout>
  );
};

export default Recordings;
