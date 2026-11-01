'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  ShieldCheck,
  Plus,
  Trash2,
  PhoneCall,
  User,
  CheckCircle2,
  AlertCircle,
  Clock,
  Shield,
  Info,
  Edit2,
  Lock,
  Eye,
  EyeOff,
  X
} from 'lucide-react';
import { TrustedContact, TransferPermission } from '@/lib/types';

interface TrustedContactsManagerProps {
  onTestContactCall?: (contact: TrustedContact) => void;
}

export const TrustedContactsManager: React.FC<TrustedContactsManagerProps> = ({
  onTestContactCall
}) => {
  const { currentTeacher, addTrustedContact, deleteTrustedContact, updateTrustedContact } = useApp();
  const contacts = currentTeacher.trustedContacts;

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContactId, setEditingContactId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [relationship, setRelationship] = useState<TrustedContact['relationship']>('Spouse');
  const [permission, setPermission] = useState<TransferPermission>('during_teaching');
  const [notes, setNotes] = useState('');

  // Privacy Masking toggle
  const [showFullNumbers, setShowFullNumbers] = useState(false);

  const handleOpenAdd = () => {
    setName('');
    setPhone('+91 ');
    setRelationship('Spouse');
    setPermission('during_teaching');
    setNotes('');
    setEditingContactId(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (c: TrustedContact) => {
    setName(c.name);
    setPhone(c.phone);
    setRelationship(c.relationship);
    setPermission(c.transferPermission);
    setNotes(c.notes || '');
    setEditingContactId(c.id);
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    if (editingContactId) {
      updateTrustedContact(editingContactId, {
        name: name.trim(),
        phone: phone.trim(),
        relationship,
        transferPermission: permission,
        notes: notes.trim()
      });
    } else {
      addTrustedContact({
        name: name.trim(),
        phone: phone.trim(),
        relationship,
        transferPermission: permission,
        notes: notes.trim() || `${relationship} priority contact`
      });
    }

    setShowAddModal(false);
    setEditingContactId(null);
  };

  const getPermissionDetails = (perm: TransferPermission) => {
    switch (perm) {
      case 'always':
        return {
          label: 'Always Pass',
          desc: 'Instantly patched through 24/7 without AI interception',
          color: 'bg-[#EDF6F0] text-[#3B7A57] dark:bg-[#13281E] dark:text-[#5BA87B] border-[#C4E1CC]'
        };
      case 'during_teaching':
        return {
          label: 'Ask During Teaching Hours',
          desc: '1-tap approval prompt on teacher screen during batch hours; direct outside',
          color: 'bg-[#EDF3FA] text-[#1B365D] dark:bg-[#1A2D4A] dark:text-[#93B4E0] border-[#D3E0EA]'
        };
      case 'never':
        return {
          label: 'Never Pass (Always Screen)',
          desc: 'Always intercepted by AI receptionist; polite message logged',
          color: 'bg-[#FDF3F0] text-[#C86D51] dark:bg-[#2C1E1B] dark:text-[#E28468] border-[#F3DFD8]'
        };
      default:
        return {
          label: 'Ask for Approval',
          desc: 'Always sends an instant 1-tap screening prompt to educator',
          color: 'bg-[#FAF6ED] text-[#C5A880] dark:bg-[#2A241A] dark:text-[#D6BD96] border-[#EAE5D9]'
        };
    }
  };

  const formatPhoneNumber = (num: string) => {
    if (showFullNumbers) return num;
    const cleaned = num.trim();
    if (cleaned.length <= 6) return cleaned;
    return `${cleaned.slice(0, 8)} •••••`;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="parchment-banner rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#1B365D] dark:text-[#93B4E0] uppercase tracking-wider">
            <Shield className="h-3.5 w-3.5 text-[#3B7A57]" />
            <span>Priority Whitelist Governance</span>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#132238] dark:text-[#F8FAFC]">
            Trusted Contacts Whitelist
          </h1>
          <p className="text-xs sm:text-sm text-[#475569] dark:text-[#CBD5E1] max-w-2xl leading-relaxed">
            Ensure family members, school principals, and doctors bypass routine tuition screenings according to your exact rules. Callers must match these verified phone numbers.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowFullNumbers(!showFullNumbers)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-[#EAE5D9] dark:border-[#22334A] bg-white dark:bg-[#121E30] text-xs font-semibold text-[#475569] dark:text-[#CBD5E1] hover:border-[#1B365D] transition-colors"
          >
            {showFullNumbers ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            <span>{showFullNumbers ? 'Mask Numbers' : 'Show Full Numbers'}</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1B365D] hover:bg-[#152B4A] text-white text-xs font-bold transition-all shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Add Trusted Contact</span>
          </button>
        </div>
      </div>

      {/* Contact Cards Table */}
      <div className="editorial-card overflow-hidden">
        <div className="px-5 py-4 border-b border-[#F0ECE3] dark:border-[#1E2E44] flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#132238] dark:text-[#F8FAFC]">
            Whitelisted Contacts ({contacts.length})
          </h2>
          <span className="text-xs text-[#64748B]">
            Protected by Verified Caller ID
          </span>
        </div>

        {contacts.length === 0 ? (
          <div className="text-center py-12 p-6 space-y-3">
            <Shield className="h-10 w-10 text-[#C5A880] mx-auto opacity-70" />
            <h3 className="text-sm font-bold text-[#132238] dark:text-[#F8FAFC]">
              No Trusted Contacts Configured
            </h3>
            <p className="text-xs text-[#64748B] max-w-sm mx-auto">
              Add your spouse, family members, or children&apos;s schools so their calls reach you even during active teaching hours.
            </p>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 rounded-full bg-[#1B365D] text-white text-xs font-bold inline-flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add First Contact</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#F0ECE3] dark:divide-[#1E2E44]">
            {contacts.map((contact) => {
              const perm = getPermissionDetails(contact.transferPermission);
              return (
                <div
                  key={contact.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAF9F6] dark:hover:bg-[#152338] transition-colors"
                >
                  {/* Left: Contact Details */}
                  <div className="flex items-start gap-3.5">
                    <div className="h-10 w-10 rounded-full bg-[#EDF3FA] dark:bg-[#1A2D4A] text-[#1B365D] dark:text-[#93B4E0] font-bold flex items-center justify-center text-xs shrink-0">
                      {contact.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#132238] dark:text-[#F8FAFC]">
                          {contact.name}
                        </span>
                        <span className="text-[11px] font-semibold text-[#64748B] dark:text-[#94A3B8]">
                          ({contact.relationship})
                        </span>
                      </div>
                      <div className="text-xs font-mono text-[#475569] dark:text-[#CBD5E1] mt-0.5">
                        {formatPhoneNumber(contact.phone)}
                      </div>
                      {contact.notes && (
                        <div className="text-[11px] text-[#64748B] italic mt-0.5">
                          {contact.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Permission Badge & Action Controls */}
                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <div className="text-right">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${perm.color}`}
                      >
                        {perm.label}
                      </span>
                      <div className="text-[10px] text-[#64748B] max-w-[200px] hidden md:block mt-0.5">
                        {perm.desc}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {onTestContactCall && (
                        <button
                          onClick={() => onTestContactCall(contact)}
                          className="p-2 rounded-lg border border-[#EAE5D9] dark:border-[#22334A] bg-white dark:bg-[#121E30] text-[#1B365D] dark:text-[#93B4E0] hover:bg-[#FAF6ED] transition-colors"
                          title="Simulate incoming call from this contact"
                        >
                          <PhoneCall className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleOpenEdit(contact)}
                        className="p-2 rounded-lg border border-[#EAE5D9] dark:border-[#22334A] bg-white dark:bg-[#121E30] text-[#475569] dark:text-[#CBD5E1] hover:text-[#132238] transition-colors"
                        title="Edit contact"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => deleteTrustedContact(contact.id)}
                        className="p-2 rounded-lg border border-[#EAE5D9] dark:border-[#22334A] bg-white dark:bg-[#121E30] text-[#C86D51] hover:bg-[#FDF3F0] transition-colors"
                        title="Remove contact"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
          <div className="w-full max-w-md rounded-2xl editorial-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0ECE3] dark:border-[#1E2E44] pb-3">
              <h3 className="text-base font-bold text-[#132238] dark:text-[#F8FAFC]">
                {editingContactId ? 'Edit Trusted Contact' : 'Add Trusted Contact'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg hover:bg-[#F2EFE8] dark:hover:bg-[#1C2D47] text-[#64748B]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#132238] dark:text-[#F8FAFC] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Anand Verma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-[#EAE5D9] dark:border-[#22334A] bg-[#FBF9F5] dark:bg-[#0C1420] px-3 py-2 text-[#132238] dark:text-[#F8FAFC] focus:outline-none focus:border-[#1B365D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#132238] dark:text-[#F8FAFC] mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="+91 98221 23456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-[#EAE5D9] dark:border-[#22334A] bg-[#FBF9F5] dark:bg-[#0C1420] px-3 py-2 text-[#132238] dark:text-[#F8FAFC] focus:outline-none focus:border-[#1B365D] font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#132238] dark:text-[#F8FAFC] mb-1">
                    Relationship
                  </label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value as any)}
                    className="w-full rounded-xl border border-[#EAE5D9] dark:border-[#22334A] bg-[#FBF9F5] dark:bg-[#0C1420] px-3 py-2 text-[#132238] dark:text-[#F8FAFC] focus:outline-none focus:border-[#1B365D]"
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Child School">Child School</option>
                    <option value="Parent">Parent</option>
                    <option value="Doctor">Doctor / Emergency</option>
                    <option value="Teaching Staff">Teaching Staff / TA</option>
                    <option value="Institute Principal">Institute Principal</option>
                    <option value="Accountant">Accountant</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#132238] dark:text-[#F8FAFC] mb-1">
                    Transfer Rule
                  </label>
                  <select
                    value={permission}
                    onChange={(e) => setPermission(e.target.value as any)}
                    className="w-full rounded-xl border border-[#EAE5D9] dark:border-[#22334A] bg-[#FBF9F5] dark:bg-[#0C1420] px-3 py-2 text-[#132238] dark:text-[#F8FAFC] focus:outline-none focus:border-[#1B365D]"
                  >
                    <option value="always">Always Pass (24/7 Direct)</option>
                    <option value="during_teaching">During Teaching (1-Tap Approval)</option>
                    <option value="never">Never Pass (Always Screen)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#132238] dark:text-[#F8FAFC] mb-1">
                  Private Note / Context
                </label>
                <input
                  type="text"
                  placeholder="e.g. Husband's personal phone"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-[#EAE5D9] dark:border-[#22334A] bg-[#FBF9F5] dark:bg-[#0C1420] px-3 py-2 text-[#132238] dark:text-[#F8FAFC] focus:outline-none focus:border-[#1B365D]"
                />
              </div>

              <div className="pt-3 border-t border-[#F0ECE3] dark:border-[#1E2E44] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-[#475569] dark:text-[#CBD5E1] hover:bg-[#F2EFE8] dark:hover:bg-[#16243A] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full text-xs font-bold text-white bg-[#1B365D] hover:bg-[#152B4A] transition-colors shadow-xs"
                >
                  {editingContactId ? 'Update Contact' : 'Save Trusted Contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
