import React, { useEffect, useState, useRef } from 'react';
import SettingsLayout from '../../../layout/SettingsLayout';
import { createAssistant, updateAssistant, listAssistants } from '../../../services/vapi';

// Import voice sample audio files (only those that exist)
import alexRegular from '../../../assets/alex-regular.mp3';
import ayden from '../../../assets/Ayden.mp3';
import andrea from '../../../assets/Andrea.mp3';
import corinne from '../../../assets/Corinne.mp3';
import nadya from '../../../assets/Nadya.mp3';
import brandonCole from '../../../assets/Brandon-Cole.mp3';
import abraham from '../../../assets/Abraham.mp3';
import canadianPresentation from '../../../assets/Canadian-Presentation.mp3';
import johnny from '../../../assets/johnny-upbeat-professional-ammerican-male.mp3';
import andrewGriffin from '../../../assets/Andrew-J-Griffin.mp3';
import hopeUpbeat from '../../../assets/hope-upbeat-and-clear.mp3';
import christian from '../../../assets/christian.mp3';
import kelly from '../../../assets/kelly.mp3';
import dakotaH from '../../../assets/dakota-h.mp3';
import desdemona from '../../../assets/desdemona-balanced.mp3';
import angie from '../../../assets/angie-upbeat-book.mp3';
import karen from '../../../assets/karen.mp3';
import nevin from '../../../assets/nevin.mp3';
import danielR from '../../../assets/daniel-r.mp3';

// English voice options for 11labs with correct asset paths (only for files that exist)
const englishVoices = [
  { id: "wv0yxfqj1VvAQTDIUQFt", name: "Alex", sample: alexRegular },
  { id: "5lm1mr2qVzTTtc8lNLgo", name: "Ayden (Male | American)", sample: ayden },
  { id: "Crm8VULvkVs5ZBDa1Ixm", name: "Andrea", sample: andrea },
  { id: "OUMziMm027FJC9FNiuZU", name: "Corinne", sample: corinne },
  { id: "GCPLhb1XrVwcoKUJYcvz", name: "Nadya", sample: nadya },
  { id: "1jOesED2SvRLTpWxQxTt", name: "Brandon Cole (Male | American)", sample: brandonCole },
  { id: "5ZvI0fBo2w7CxuiM9ObF", name: "Abraham (Male | Canadian)", sample: abraham },
  { id: "y26Xv4PQ7Ftbu1mfaEFY", name: "Canadian Presentation (Male | Canadian)", sample: canadianPresentation },
  { id: "JZ3e95uoTACVf6tXaaEi", name: "Johnny (Male | American)", sample: johnny },
  { id: "Av6UPhNoPwr9E4GrgD59", name: "Andrew J Griffin (Male | American)", sample: andrewGriffin },
  { id: "tnSpp4vdxKPjI9w0GnoV", name: "Hope Upbeat (Female | American)", sample: hopeUpbeat },
  { id: "6xPz2opT0y5qtoRh1U1Y", name: "Christian (Male | American)", sample: christian },
  { id: "H61ermx0gHYPgQYw03E4", name: "Kelly (Female | American)", sample: kelly },
  { id: "P7x743VjyZEOihNNygQ9", name: "Dakota H (Female | American)", sample: dakotaH },
  { id: "lMnsO7jPYvWHrnTWQNOh", name: "Desdemona (Female | American)", sample: desdemona },
  { id: "aVR2rUXJY4MTezzJjPyQ", name: "Angie (Female | American)", sample: angie },
  { id: "jqVMajy0TkayOvIB8eCz", name: "Karen (Female | American)", sample: karen },
  { id: "Lq3QTLIHMhQILiCnYjTG", name: "Nevin (Male | American)", sample: nevin },
  { id: "ZMK5OD2jmsdse3EKE4W5", name: "Daniel (Male | American)", sample: danielR },
];

const AssistantSettings = () => {
  const [assistantId, setAssistantId] = useState('');
  const [name, setName] = useState('');
  const [firstMessage, setFirstMessage] = useState('');
  const [voiceId, setVoiceId] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [list, setList] = useState([]);
  const [listLoading, setListLoading] = useState(false);

  // Audio playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayingVoice, setCurrentPlayingVoice] = useState('');
  const audioRef = useRef(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'update'

  function parseToolIds(raw) {
    return raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }

  // Audio playback functions
  const playVoiceSample = (voiceId, sampleUrl) => {
    if (audioRef.current) {
      if (isPlaying && currentPlayingVoice === voiceId) {
        // Stop current audio
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
        setCurrentPlayingVoice('');
      } else {
        // Play new audio
        if (isPlaying) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        audioRef.current.src = sampleUrl;
        audioRef.current.play();
        setIsPlaying(true);
        setCurrentPlayingVoice(voiceId);
      }
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentPlayingVoice('');
  };

  async function fetchList() {
    setListLoading(true);
    try {
      const resp = await listAssistants();
      if (resp?.success) {
        setList(resp?.data || []);
      } else {
        setError(resp?.message || 'Failed to load assistants');
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load assistants');
    } finally {
      setListLoading(false);
    }
  }

  useEffect(() => {
    fetchList();
  }, []);

  function loadForUpdate(a) {
    setAssistantId(a.assistantId);
    setName(a.name || '');
    setFirstMessage(a.firstMessage || '');
    setVoiceId(a.voiceId || '');
    setContent(a.content || '');
    setMessage('');
    setError('');
    setModalMode('update');
    setShowModal(true);
  }

  function openCreateModal() {
    setAssistantId('');
    setName('');
    setFirstMessage('');
    setVoiceId('');
    setContent('');
    setMessage('');
    setError('');
    setModalMode('create');
    setShowModal(true);
  }

  async function handleCreate(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const payload = {
        name,
        firstMessage,
        voiceId,
        content,
      };
      const resp = await createAssistant(payload);
      if (resp?.success) {
        setAssistantId(resp?.data?.id || '');
        setMessage('Assistant created successfully');
        fetchList();
      } else {
        setError(resp?.message || 'Failed to create assistant');
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to create assistant');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    if (!assistantId) {
      setError('Select an assistant to update from the list');
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const payload = {
        name: name || undefined,
        firstMessage: firstMessage || undefined,
        voiceId: voiceId || undefined,
        content: content || undefined,
      };
      const resp = await updateAssistant(assistantId, payload);
      if (resp?.success) {
        setMessage('Assistant updated successfully');
        fetchList();
      } else {
        setError(resp?.message || 'Failed to update assistant');
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to update assistant');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SettingsLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Knowledge Base Assistant</h2>
            <p className="text-sm text-gray-600 mt-1">Manage your voice assistants. Create new or update existing ones.</p>
          </div>
          <button className="btn btn-primary" onClick={openCreateModal}>Create Assistant</button>
        </div>
        
        {/* Hidden audio element for voice samples */}
        <audio ref={audioRef} onEnded={handleAudioEnded} style={{ display: 'none' }} />
        
        {/* Assistants List Full Width */}
        <div className="bg-white rounded-lg shadow border border-gray-100">
          <div className="px-5 py-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium text-gray-900">Assistants</h3>
              <span className="text-xs text-gray-500">{listLoading ? 'Loading…' : `${list?.length || 0} total`}</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-5 text-xs font-semibold text-gray-600">Name</th>
                  <th className="py-2 px-5 text-xs font-semibold text-gray-600">Voice</th>
                  <th className="py-2 px-5 text-xs font-semibold text-gray-600">Content Preview</th>
                  <th className="py-2 px-5 text-right text-xs font-semibold text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {list?.length === 0 && !listLoading && (
                  <tr>
                    <td className="py-6 px-5 text-sm text-gray-500" colSpan={4}>No assistants created yet.</td>
                  </tr>
                )}
                {list?.map((a) => (
                  <tr key={a.id} className="border-b hover:bg-gray-50/50">
                    <td className="py-3 px-5 align-top">
                      <div className="font-medium text-gray-900">{a.name}</div>
                      <div className="text-xs text-gray-500">{a.assistantId}</div>
                    </td>
                    <td className="py-3 px-5 align-top">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700">{englishVoices.find(v => v.id === a.voiceId)?.name || a.voiceId || '-'}</span>
                        {a.voiceId && (
                          <button
                            type="button"
                            onClick={() => {
                              const voice = englishVoices.find(v => v.id === a.voiceId);
                              if (voice) {
                                playVoiceSample(voice.id, voice.sample);
                              }
                            }}
                            className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-xs"
                          >
                            {isPlaying && currentPlayingVoice === a.voiceId ? '⏸️' : '▶️'}
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-5 align-top">
                      <div className="max-w-md truncate text-sm text-gray-700" title={a.content || ''}>
                        {a.content ? (a.content.length > 80 ? a.content.substring(0, 80) + '…' : a.content) : '-'}
                      </div>
                    </td>
                    <td className="py-3 px-5 align-middle whitespace-nowrap">
                      <div className="flex items-center justify-end w-full">
                        <button className="btn btn-primary" onClick={() => loadForUpdate(a)} disabled={listLoading}>Update</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)}></div>
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
              <div className="px-5 py-4 border-b flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-gray-900">{modalMode === 'update' ? 'Update Assistant' : 'Create Assistant'}</h3>
                  <p className="text-xs text-gray-600 mt-1">{modalMode === 'update' ? 'Modify the selected assistant settings.' : 'Define name, greeting, voice, and knowledge base.'}</p>
                </div>
                <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowModal(false)}>✕</button>
              </div>
              <form
                className="px-5 py-5 space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (modalMode === 'update') {
                    await handleUpdate(e);
                  } else {
                    await handleCreate(e);
                  }
                  if (!error) {
                    setShowModal(false);
                  }
                }}
              >
                {modalMode === 'update' ? (
                  <div className="text-xs text-gray-600">Editing assistant: <span className="font-medium text-gray-900">{assistantId}</span></div>
                ) : null}

          <div>
            <label className="fs-12 text-[#667085] mb-1 block">Name</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Assistant name" required />
          </div>
          <div>
            <label className="fs-12 text-[#667085] mb-1 block">First Message</label>
            <input className="input" value={firstMessage} onChange={(e) => setFirstMessage(e.target.value)} placeholder="Hello, how can I help you?" required />
          </div>
          <div>
            <label className="fs-12 text-[#667085] mb-1 block">Voice</label>
            <div className="flex gap-2">
              <select className="input flex-1" value={voiceId} onChange={(e) => setVoiceId(e.target.value)} required>
                <option value="">Select a voice</option>
                {englishVoices.map((voice) => (
                  <option key={voice.id} value={voice.id}>
                    {voice.name}
                  </option>
                ))}
              </select>
              {voiceId && (
                <button
                  type="button"
                  onClick={() => {
                    const voice = englishVoices.find(v => v.id === voiceId);
                    if (voice) {
                      playVoiceSample(voice.id, voice.sample);
                    }
                  }}
                  className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                  disabled={!voiceId}
                >
                  {isPlaying && currentPlayingVoice === voiceId ? '⏸️' : '▶️'}
                </button>
              )}
            </div>
          </div>
                <div>
            <label className="fs-12 text-[#667085] mb-1 block">Knowledge Base Content</label>
            <textarea 
                    className="input h-40 resize-none" 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              placeholder="Enter the knowledge base content that the assistant should use to answer questions..."
              required
            />
                  <p className="text-[11px] text-gray-500 mt-1">Provide clear, concise information. You can update this later.</p>
          </div>

                {error && <div className="text-red-600">{error}</div>}
                {message && <div className="text-green-600">{message}</div>}

                <div className="pt-1 flex items-center gap-3 justify-end">
                  <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? (modalMode === 'update' ? 'Updating…' : 'Creating…') : (modalMode === 'update' ? 'Update Assistant' : 'Create Assistant')}</button>
          </div>
        </form>
                    </div>
                    </div>
        )}
      </div>
    </SettingsLayout>
  );
};

export default AssistantSettings;
