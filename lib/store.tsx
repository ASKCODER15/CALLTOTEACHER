'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  TeacherAccount,
  ClassProfile,
  TrustedContact,
  CallSettings,
  CallLogItem,
  FAQItem,
  FollowUpStatus,
  PendingApproval
} from './types';
import { INITIAL_TEACHERS } from './demo-data';

interface AppContextType {
  teachers: TeacherAccount[];
  currentTeacher: TeacherAccount;
  currentTeacherId: string;
  setCurrentTeacherId: (id: string) => void;
  updateClassProfile: (profile: Partial<ClassProfile>) => void;
  addTrustedContact: (contact: Omit<TrustedContact, 'id' | 'createdAt'>) => void;
  updateTrustedContact: (id: string, contact: Partial<TrustedContact>) => void;
  deleteTrustedContact: (id: string) => void;
  updateCallSettings: (settings: Partial<CallSettings>) => void;
  addCallLog: (log: Omit<CallLogItem, 'id' | 'isSyntheticDemo'>) => CallLogItem;
  updateCallFollowUp: (callId: string, status: FollowUpStatus) => void;
  addFAQ: (faq: Omit<FAQItem, 'id'>) => void;
  updateFAQ: (id: string, faq: Partial<FAQItem>) => void;
  deleteFAQ: (id: string) => void;
  pendingApprovals: PendingApproval[];
  createPendingApproval: (data: Omit<PendingApproval, 'id' | 'secondsRemaining' | 'status'>) => PendingApproval;
  approveTransfer: (approvalId: string) => void;
  declineTransfer: (approvalId: string, reason?: string) => void;
  triggerApprovalTimeout: (approvalId: string) => void;
  clearPendingApproval: (approvalId: string) => void;
  resetDemoData: () => void;
}

const STORAGE_KEY = 'talktoteach_teachers_v1';
const ACTIVE_TEACHER_KEY = 'talktoteach_active_teacher_id';

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [teachers, setTeachers] = useState<TeacherAccount[]>(INITIAL_TEACHERS);
  const [currentTeacherId, setCurrentTeacherId] = useState<string>('teacher_bhavani');
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const isHydratedRef = React.useRef(false);

  // Load persisted state from localStorage on client mount
  useEffect(() => {
    try {
      const savedTeachers = localStorage.getItem(STORAGE_KEY);
      const savedTeacherId = localStorage.getItem(ACTIVE_TEACHER_KEY);
      
      queueMicrotask(() => {
        if (savedTeachers) {
          try {
            const parsed = JSON.parse(savedTeachers);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setTeachers(parsed);
            }
          } catch {}
        }
        if (savedTeacherId) {
          setCurrentTeacherId(savedTeacherId);
        }
        isHydratedRef.current = true;
      });
    } catch {
      isHydratedRef.current = true;
    }
  }, []);

  // Synchronize state updates to storage only after initial hydration
  useEffect(() => {
    if (!isHydratedRef.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(teachers));
    } catch {
      // Ignore quota or disabled storage
    }
  }, [teachers]);

  useEffect(() => {
    if (!isHydratedRef.current) return;
    try {
      localStorage.setItem(ACTIVE_TEACHER_KEY, currentTeacherId);
    } catch {}
  }, [currentTeacherId]);

  const currentTeacher =
    teachers.find((t) => t.id === currentTeacherId) || teachers[0] || INITIAL_TEACHERS[0];

  const updateCurrentTeacher = (updater: (prev: TeacherAccount) => TeacherAccount) => {
    setTeachers((prevList) =>
      prevList.map((t) => (t.id === currentTeacher.id ? updater(t) : t))
    );
  };

  const updateClassProfile = (profile: Partial<ClassProfile>) => {
    updateCurrentTeacher((t) => ({
      ...t,
      profile: { ...t.profile, ...profile }
    }));
  };

  const addTrustedContact = (contact: Omit<TrustedContact, 'id' | 'createdAt'>) => {
    const newContact: TrustedContact = {
      ...contact,
      id: `tc_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    updateCurrentTeacher((t) => ({
      ...t,
      trustedContacts: [newContact, ...t.trustedContacts]
    }));
  };

  const updateTrustedContact = (id: string, contact: Partial<TrustedContact>) => {
    updateCurrentTeacher((t) => ({
      ...t,
      trustedContacts: t.trustedContacts.map((c) => (c.id === id ? { ...c, ...contact } : c))
    }));
  };

  const deleteTrustedContact = (id: string) => {
    updateCurrentTeacher((t) => ({
      ...t,
      trustedContacts: t.trustedContacts.filter((c) => c.id !== id)
    }));
  };

  const updateCallSettings = (settings: Partial<CallSettings>) => {
    updateCurrentTeacher((t) => ({
      ...t,
      callSettings: { ...t.callSettings, ...settings }
    }));
  };

  const addCallLog = (log: Omit<CallLogItem, 'id' | 'isSyntheticDemo'>): CallLogItem => {
    const newLog: CallLogItem = {
      ...log,
      id: `call_${Date.now()}`,
      isSyntheticDemo: true
    };
    updateCurrentTeacher((t) => ({
      ...t,
      callHistory: [newLog, ...t.callHistory]
    }));
    return newLog;
  };

  const updateCallFollowUp = (callId: string, status: FollowUpStatus) => {
    updateCurrentTeacher((t) => ({
      ...t,
      callHistory: t.callHistory.map((c) => (c.id === callId ? { ...c, followUpStatus: status } : c))
    }));
  };

  const addFAQ = (faq: Omit<FAQItem, 'id'>) => {
    const newFaq: FAQItem = {
      ...faq,
      id: `faq_${Date.now()}`
    };
    updateCurrentTeacher((t) => ({
      ...t,
      profile: {
        ...t.profile,
        faqs: [...t.profile.faqs, newFaq]
      }
    }));
  };

  const updateFAQ = (id: string, faq: Partial<FAQItem>) => {
    updateCurrentTeacher((t) => ({
      ...t,
      profile: {
        ...t.profile,
        faqs: t.profile.faqs.map((f) => (f.id === id ? { ...f, ...faq } : f))
      }
    }));
  };

  const deleteFAQ = (id: string) => {
    updateCurrentTeacher((t) => ({
      ...t,
      profile: {
        ...t.profile,
        faqs: t.profile.faqs.filter((f) => f.id !== id)
      }
    }));
  };

  const createPendingApproval = (data: Omit<PendingApproval, 'id' | 'secondsRemaining' | 'status'>): PendingApproval => {
    const item: PendingApproval = {
      ...data,
      id: `approval_${Date.now()}`,
      secondsRemaining: currentTeacher.callSettings.timeoutSeconds || 15,
      status: 'pending'
    };
    setPendingApprovals((prev) => [item, ...prev]);
    return item;
  };

  const approveTransfer = (approvalId: string) => {
    setPendingApprovals((prev) =>
      prev.map((a) => (a.id === approvalId ? { ...a, status: 'approved' } : a))
    );
  };

  const declineTransfer = (approvalId: string) => {
    setPendingApprovals((prev) =>
      prev.map((a) => (a.id === approvalId ? { ...a, status: 'declined' } : a))
    );
  };

  const triggerApprovalTimeout = (approvalId: string) => {
    setPendingApprovals((prev) =>
      prev.map((a) => (a.id === approvalId ? { ...a, status: 'timed_out' } : a))
    );
  };

  const clearPendingApproval = (approvalId: string) => {
    setPendingApprovals((prev) => prev.filter((a) => a.id !== approvalId));
  };

  const resetDemoData = () => {
    setTeachers(INITIAL_TEACHERS);
    setCurrentTeacherId('teacher_bhavani');
    setPendingApprovals([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(ACTIVE_TEACHER_KEY);
    } catch {}
  };

  return (
    <AppContext.Provider
      value={{
        teachers,
        currentTeacher,
        currentTeacherId,
        setCurrentTeacherId,
        updateClassProfile,
        addTrustedContact,
        updateTrustedContact,
        deleteTrustedContact,
        updateCallSettings,
        addCallLog,
        updateCallFollowUp,
        addFAQ,
        updateFAQ,
        deleteFAQ,
        pendingApprovals,
        createPendingApproval,
        approveTransfer,
        declineTransfer,
        triggerApprovalTimeout,
        clearPendingApproval,
        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
