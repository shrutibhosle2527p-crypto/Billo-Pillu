import React, { useState } from 'react';
import { MemoryMilestone } from '../types';
import { sound } from '../utils/audio';

interface ScrapbookProps {
  milestones: MemoryMilestone[];
  startDateStr: string;
  onUpdateStartDate: (newDate: string) => void;
  onAddMemory: (memory: MemoryMilestone) => void;
  onClose: () => void;
}

export const Scrapbook: React.FC<ScrapbookProps> = ({
  milestones,
  startDateStr,
  onUpdateStartDate,
  onAddMemory,
  onClose,
}) => {
  const [selectedMilestone, setSelectedMilestone] = useState<MemoryMilestone | null>(
    milestones[0] || null
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newNote, setNewNote] = useState('');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  // Calculate live days/hours together
  const start = new Date(startDateStr);
  const now = new Date();
  const diffTime = Math.max(0, now.getTime() - start.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffTime / (1000 * 60));

  const handleSaveMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newMilestone: MemoryMilestone = {
      id: `custom_${Date.now()}`,
      title: newTitle.trim(),
      dateStr: newDate || 'Special Day',
      category: 'anniversary',
      description: newDesc.trim() || 'A cherished memory in our journey.',
      specialNote: newNote.trim() || 'One more reason I adore you.',
      photoUrl: newPhotoUrl.trim() || undefined,
      unlocked: true,
      crystalIndex: 4,
      icon: '📸',
    };

    onAddMemory(newMilestone);
    setSelectedMilestone(newMilestone);
    setShowAddModal(false);
    setNewTitle('');
    setNewDesc('');
    setNewNote('');
    setNewPhotoUrl('');
    sound.playHeartPickup();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3 md:p-6 font-pixel select-none overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#1a0c28] pixel-border border-pink-400 flex flex-col overflow-hidden text-pink-100 shadow-2xl">
        {/* Header Bar */}
        <div className="bg-[#2a0e40] p-4 flex items-center justify-between border-b-2 border-pink-600">
          <div className="flex items-center gap-2">
            <span className="text-xl">📖</span>
            <div>
              <h2 className="text-xs md:text-sm text-yellow-300 font-bold uppercase tracking-wider">
                Billo & Pillu: The 1-Year Memory Museum
              </h2>
              <p className="text-[9px] text-pink-300 mt-0.5">
                Every milestone, late-night chat, and unforgettable smile
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-pink-800 hover:bg-pink-700 text-white text-xs pixel-corners"
          >
            ✕ Close
          </button>
        </div>

        {/* Live Love Stats Counter Strip */}
        <div className="bg-[#12061e] px-4 py-3 border-b border-pink-900/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-pink-300">
            <span>📅 Anniversary Date:</span>
            <input
              type="date"
              value={startDateStr}
              onChange={(e) => onUpdateStartDate(e.target.value)}
              className="bg-[#240b3b] text-yellow-300 text-[10px] px-2 py-1 border border-pink-500 rounded focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-4 text-[10px] md:text-xs">
            <span className="text-pink-300">
              <strong className="text-yellow-300 text-sm">{diffDays}</strong> Days
            </span>
            <span className="text-pink-300">
              <strong className="text-pink-400 text-sm">{diffHours.toLocaleString()}</strong> Hours
            </span>
            <span className="text-pink-300">
              <strong className="text-rose-400 text-sm">{diffMinutes.toLocaleString()}</strong> Mins of Love
            </span>
          </div>
        </div>

        {/* Content Body: Sidebar List + Polaroid Card */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Milestone List Column */}
          <div className="md:col-span-5 p-3 overflow-y-auto border-r border-pink-900/50 space-y-2 max-h-[300px] md:max-h-none">
            <div className="flex items-center justify-between pb-1">
              <span className="text-[10px] text-pink-400 uppercase font-bold">
                Unlocked Memories ({milestones.length})
              </span>
              <button
                onClick={() => setShowAddModal(true)}
                className="text-[9px] text-yellow-300 bg-pink-950 px-2 py-0.5 border border-pink-500 hover:bg-pink-900"
              >
                + Add Memory
              </button>
            </div>

            {milestones.map((m) => {
              const isSelected = selectedMilestone?.id === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => {
                    sound.playJump();
                    setSelectedMilestone(m);
                  }}
                  className={`p-2.5 cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-pink-950/80 border-pink-400 shadow-md translate-x-1'
                      : 'bg-[#220a35]/60 border-pink-900/40 hover:bg-[#2b0f42]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-yellow-200 flex items-center gap-1.5">
                      <span>{m.icon}</span>
                      <span className="truncate max-w-[170px]">{m.title}</span>
                    </span>
                    <span className="text-[9px] text-pink-400 shrink-0">{m.dateStr}</span>
                  </div>
                  <div className="text-[9px] text-pink-300/70 truncate mt-1">
                    {m.description}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Polaroid Card Display */}
          <div className="md:col-span-7 p-4 md:p-6 overflow-y-auto flex flex-col justify-between bg-gradient-to-br from-[#1c0a2c] to-[#0e0417]">
            {selectedMilestone ? (
              <div className="bg-[#fef9f3] text-gray-800 p-4 md:p-6 shadow-2xl rotate-[-0.5deg] border-4 border-[#eae0d5] flex flex-col justify-between">
                <div>
                  {/* Photo area */}
                  <div className="w-full h-44 md:h-52 bg-gradient-to-tr from-pink-200 via-rose-100 to-amber-100 border-2 border-dashed border-pink-300 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
                    {selectedMilestone.photoUrl ? (
                      <img
                        src={selectedMilestone.photoUrl}
                        alt={selectedMilestone.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        <span className="text-4xl mb-2 animate-bounce">
                          {selectedMilestone.icon}
                        </span>
                        <span className="font-pixel text-[10px] text-pink-700">
                          {selectedMilestone.title}
                        </span>
                        <span className="text-[9px] text-pink-500 font-retro text-lg mt-1">
                          Billo & Pillu Forever
                        </span>
                      </>
                    )}
                  </div>

                  {/* Caption */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-pink-800 font-bold border-b border-pink-200 pb-1">
                      <span>{selectedMilestone.title}</span>
                      <span className="font-normal text-[10px] text-gray-500">
                        {selectedMilestone.dateStr}
                      </span>
                    </div>
                    <p className="font-retro text-2xl text-gray-700 leading-snug mt-2">
                      {selectedMilestone.description}
                    </p>
                  </div>
                </div>

                {selectedMilestone.specialNote && (
                  <div className="mt-4 pt-3 border-t border-dashed border-pink-200 font-retro text-xl text-pink-700 italic">
                    💝 Note: "{selectedMilestone.specialNote}"
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-pink-400">
                Select a memory from the left to view its polaroid!
              </div>
            )}
          </div>
        </div>

        {/* Modal: Add Custom Memory */}
        {showAddModal && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <form
              onSubmit={handleSaveMemory}
              className="bg-[#240b3b] pixel-border border-yellow-400 p-5 max-w-md w-full space-y-3"
            >
              <h3 className="text-xs text-yellow-300 uppercase font-bold">
                Add Our Real Memory
              </h3>
              <div>
                <label className="text-[9px] text-pink-300 block mb-1">Title / Milestone:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Our favorite beach sunset"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#150524] text-xs text-white p-2 border border-pink-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[9px] text-pink-300 block mb-1">Date / Month:</label>
                <input
                  type="text"
                  placeholder="e.g. August 14 or Month 6"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-[#150524] text-xs text-white p-2 border border-pink-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[9px] text-pink-300 block mb-1">The Story / Memory:</label>
                <textarea
                  rows={2}
                  placeholder="Write the sweet story of what happened..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-[#150524] text-xs text-white p-2 border border-pink-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[9px] text-pink-300 block mb-1">Optional Photo Image URL:</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  className="w-full bg-[#150524] text-xs text-white p-2 border border-pink-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[9px] text-pink-300 block mb-1">Special Inside Joke / Sweet Note:</label>
                <input
                  type="text"
                  placeholder="e.g. We both dropped our ice creams right after!"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full bg-[#150524] text-xs text-white p-2 border border-pink-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1 bg-gray-800 text-gray-300 text-[10px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-black text-[10px] font-bold"
                >
                  Save Polaroid
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
