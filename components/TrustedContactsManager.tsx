'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  ShieldCheck,
  Plus,
  Trash2,
  PhoneCall,
  Search
} from 'lucide-react';
import { TransferPermission, TrustedContact } from '@/lib/types';

interface TrustedContactsProps {
  onTestContactCall: (contact: TrustedContact) => void;
}

export const TrustedContactsManager: React.FC<TrustedContactsProps> = ({
  onTestContactCall
}) => {
  const { currentTeacher, addTrustedContact, updateTrustedContact, deleteTrustedContact } = useApp();
  const contacts = currentTeacher.trustedContacts;

  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Contact Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [relationship, setRelationship] = useState<TrustedContact['relationship']>('Spouse');
  const [transferPermission, setTransferPermission] = useState<TransferPermission>('during_teaching');
  const [notes, setNotes] = useState('');

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.relationship.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    addTrustedContact({
      name: name.trim(),
      phone: phone.trim(),
      relationship,
      transferPermission,
      notes: notes.trim()
    });

    setName('');
    setPhone('+91 ');
    setNotes('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Trusted Contacts &amp; Routing Rules
          </h2>
          <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
            Define specific transfer permissions for approved family, school administration, and assistants.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2 self-start rounded-lg px-4 py-2 text-xs font-bold"
        >
          <Plus className="h-4 w-4" />
          <span>Add Trusted Contact</span>
        </button>
      </div>

      {/* Security Rule Callout */}
      <div className="rounded-lg border border-indigo-200 bg-indigo-50/80 p-4 text-xs text-indigo-950 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-200">
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="h-4 w-4 text-indigo-700 mt-0.5 shrink-0 dark:text-indigo-400" />
          <div>
            <strong className="font-bold">Zero Unverified Trust:</strong> A caller claiming to be a family member or relative is NOT trusted unless their incoming number strictly matches an entry below. CallSetu screens and requires 1-tap teacher authorization whenever identity is unverified.
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search trusted contacts by name, relationship, or number..."
          className="w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
        />
      </div>

      {/* Contacts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            className="pro-card rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-400 transition"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {contact.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-bold text-indigo-800 dark:text-indigo-400">
                      {contact.relationship}
                    </span>
                    <span className="text-slate-400 dark:text-slate-600">·</span>
                    <span className="text-xs text-slate-700 dark:text-slate-300 font-bold tabular-nums">
                      {contact.phone}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => deleteTrustedContact(contact.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                  title="Delete Contact"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Permission Rule Selection */}
              <div className="space-y-1.5 pt-1 border-t border-slate-200 dark:border-slate-800">
                <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                  Transfer Permission:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {(['always', 'during_teaching', 'never'] as TransferPermission[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => updateTrustedContact(contact.id, { transferPermission: p })}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${
                        contact.transferPermission === p
                          ? 'bg-indigo-700 text-white'
                          : 'bg-slate-100 text-slate-800 border border-slate-300 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {p === 'always'
                        ? 'Always'
                        : p === 'during_teaching'
                        ? 'During Teaching (Approval)'
                        : 'Never (Message)'}
                    </button>
                  ))}
                </div>
              </div>

              {contact.notes && (
                <p className="text-[11px] text-slate-800 font-medium italic bg-slate-100 p-2 rounded-lg dark:bg-slate-800/60 dark:text-slate-200">
                  &quot;{contact.notes}&quot;
                </p>
              )}
            </div>

            {/* Test Incoming Call Button */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-700 dark:text-slate-300 font-bold">
                Rule: {contact.transferPermission}
              </span>
              <button
                onClick={() => onTestContactCall(contact)}
                className="btn-secondary flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold"
              >
                <PhoneCall className="h-3 w-3 text-indigo-700 dark:text-indigo-400" />
                <span>Simulate Call</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4">
          <div className="pro-card w-full max-w-md rounded-xl p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Add New Trusted Contact
            </h3>
            <p className="text-xs text-slate-500">
              Only numbers added here will be recognized by CallSetu as pre-approved contacts.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Anand Verma (Husband)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number (Demo)
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98221 23456"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Relationship
                  </label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value as TrustedContact['relationship'])}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Spouse">Spouse / Partner</option>
                    <option value="Parent">Parent</option>
                    <option value="Child School">Child&apos;s School Desk</option>
                    <option value="School Principal">School Principal / Head</option>
                    <option value="Co-Teacher">Co-Teacher</option>
                    <option value="Lab Assistant">Lab / Printing Assistant</option>
                    <option value="Doctor">Family Doctor / Clinic</option>
                    <option value="Accountant">Accountant</option>
                    <option value="Other">Other Family</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Transfer Permission Setting
                </label>
                <select
                  value={transferPermission}
                  onChange={(e) => setTransferPermission(e.target.value as TransferPermission)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="during_teaching">During Teaching Hours (Send 1-Tap Approval)</option>
                  <option value="always">Always Transfer (High Priority)</option>
                  <option value="never">Never Transfer (Polite Message Only)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Notes for CallSetu AI (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Urgent only, or take grocery message"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary rounded-lg px-4 py-2 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary rounded-lg px-4 py-2 text-xs font-bold"
                >
                  Add Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
