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
  addNewTeacher: (name: string, category: string, className: string) => void;
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
  createPendingApproval: (data: {
    callerName: string;
    callerNumber: string;
    relationship?: string;
    purpose: string;
    callId?: string;
    urgency?: 'high' | 'normal';
    timestamp?: string;
  }) => PendingApproval;
  approveTransfer: (approvalId: string) => void;
  declineTransfer: (approvalId: string, reason?: string) => void;
  triggerApprovalTimeout: (approvalId: string) => void;
  clearPendingApproval: (approvalId: string) => void;
  resetDemoData: () => void;
}

const STORAGE_KEY = 'calltoteach_teachers_v2';
const ACTIVE_TEACHER_KEY = 'calltoteach_active_teacher_id';

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [teachers, setTeachers] = useState<TeacherAccount[]>(INITIAL_TEACHERS);
  const [currentTeacherId, setCurrentTeacherId] = useState<string>('teacher_sunita');
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
      // Ignore storage errors
    }
  }, [teachers]);

  useEffect(() => {
    if (!isHydratedRef.current) return;
    try {
      localStorage.setItem(ACTIVE_TEACHER_KEY, currentTeacherId);
    } catch {}
  }, [currentTeacherId]);

  const rawTeacher =
    teachers.find((t) => t.id === currentTeacherId) || teachers[0] || INITIAL_TEACHERS[0];

  const currentTeacher: TeacherAccount = {
    ...rawTeacher,
    callSettings: {
      ...rawTeacher.callSettings,
      aiVoice: rawTeacher.callSettings?.aiVoice || 'Nalini',
      aiModel: rawTeacher.callSettings?.aiModel || 'timbre-v2.5',
      aiSpeed: rawTeacher.callSettings?.aiSpeed ?? 1.0,
      aiLanguage: rawTeacher.callSettings?.aiLanguage || 'hinglish',
      aiVoiceTone: rawTeacher.callSettings?.aiVoiceTone || 'warm_respectful'
    }
  };

  const updateCurrentTeacher = (updater: (prev: TeacherAccount) => TeacherAccount) => {
    setTeachers((prevList) =>
      prevList.map((t) => (t.id === currentTeacher.id ? updater(t) : t))
    );
  };

  const addNewTeacher = (name: string, category: string, className: string) => {
    const id = `teacher_${Date.now()}`;
    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const newTeacher: TeacherAccount = {
      id,
      name,
      category,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@calltoteach.in`,
      avatar: initials || 'TC',
      profile: {
        className,
        tagline: `${category} · Personalized Coaching`,
        teacherName: name,
        category: category as any,
        qualification: 'Experienced Educator',
        experienceYears: 5,
        phone: '+91 98000 00000',
        location: 'Coaching Studio / Home Classroom',
        city: 'Delhi',
        pincode: '110001',
        grades: ['Beginner', 'Intermediate', 'Board Prep'],
        subjects: [category],
        feeStructure: [
          {
            gradeCategory: 'Monthly Regular Tuition',
            amount: '₹3,000',
            billingCycle: 'per month',
            details: 'Includes personalized study notes and weekly doubt clinics.'
          }
        ],
        batches: [
          {
            id: `b_${Date.now()}`,
            name: 'Regular Batch A',
            timing: '05:00 PM - 06:30 PM',
            grades: 'All Grades',
            days: 'Mon, Wed, Fri',
            seatsTotal: 15,
            seatsLeft: 5
          }
        ],
        teachingHours: {
          start: '16:00',
          end: '21:00',
          days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        },
        admissionsPolicy: 'Free trial lesson available upon prior reservation.',
        faqs: [
          {
            id: `faq_${Date.now()}`,
            question: 'What are the batch timings?',
            answer: 'Classes run on weekday evenings between 5:00 PM and 8:30 PM.'
          }
        ]
      },
      trustedContacts: [],
      callSettings: {
        teachingHoursEnabled: true,
        teachingStart: '16:00',
        teachingEnd: '21:00',
        teachingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        aiLanguage: 'hinglish',
        aiVoiceTone: 'warm_respectful',
        aiVoice: 'Nalini',
        aiModel: 'timbre-v2.5',
        aiSpeed: 1.0,
        personalCallApproval: 'always_ask',
        timeoutAction: 'take_message',
        timeoutSeconds: 15,
        allowEmergencyBypass: true,
        sendWhatsappSummaryToTeacher: true,
        sendWhatsappConfirmationToCaller: true
      },
      callHistory: []
    };

    setTeachers((prev) => [newTeacher, ...prev]);
    setCurrentTeacherId(id);
  };

  const updateClassProfile = (newProfile: Partial<ClassProfile>) => {
    updateCurrentTeacher((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        ...newProfile
      }
    }));
  };

  const addTrustedContact = (contact: Omit<TrustedContact, 'id' | 'createdAt'>) => {
    const newContact: TrustedContact = {
      ...contact,
      id: `tc_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    updateCurrentTeacher((prev) => ({
      ...prev,
      trustedContacts: [newContact, ...prev.trustedContacts]
    }));
  };

  const updateTrustedContact = (id: string, updated: Partial<TrustedContact>) => {
    updateCurrentTeacher((prev) => ({
      ...prev,
      trustedContacts: prev.trustedContacts.map((c) => (c.id === id ? { ...c, ...updated } : c))
    }));
  };

  const deleteTrustedContact = (id: string) => {
    updateCurrentTeacher((prev) => ({
      ...prev,
      trustedContacts: prev.trustedContacts.filter((c) => c.id !== id)
    }));
  };

  const updateCallSettings = (settings: Partial<CallSettings>) => {
    updateCurrentTeacher((prev) => ({
      ...prev,
      callSettings: {
        ...prev.callSettings,
        ...settings
      }
    }));
  };

  const addCallLog = (log: Omit<CallLogItem, 'id' | 'isSyntheticDemo'>): CallLogItem => {
    const newLog: CallLogItem = {
      ...log,
      id: `call_${Date.now()}`,
      isSyntheticDemo: true
    };
    updateCurrentTeacher((prev) => ({
      ...prev,
      callHistory: [newLog, ...prev.callHistory]
    }));
    return newLog;
  };

  const updateCallFollowUp = (callId: string, status: FollowUpStatus) => {
    updateCurrentTeacher((prev) => ({
      ...prev,
      callHistory: prev.callHistory.map((c) =>
        c.id === callId ? { ...c, followUpStatus: status } : c
      )
    }));
  };

  const addFAQ = (faq: Omit<FAQItem, 'id'>) => {
    const newFaq: FAQItem = {
      id: `faq_${Date.now()}`,
      ...faq
    };
    updateCurrentTeacher((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        faqs: [...prev.profile.faqs, newFaq]
      }
    }));
  };

  const updateFAQ = (id: string, updated: Partial<FAQItem>) => {
    updateCurrentTeacher((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        faqs: prev.profile.faqs.map((f) => (f.id === id ? { ...f, ...updated } : f))
      }
    }));
  };

  const deleteFAQ = (id: string) => {
    updateCurrentTeacher((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        faqs: prev.profile.faqs.filter((f) => f.id !== id)
      }
    }));
  };

  // Pending Approvals
  const createPendingApproval = (data: {
    callerName: string;
    callerNumber: string;
    relationship?: string;
    purpose: string;
    callId?: string;
    urgency?: 'high' | 'normal';
    timestamp?: string;
  }): PendingApproval => {
    const approval: PendingApproval = {
      id: `appr_${Date.now()}`,
      callId: data.callId || `call_${Date.now()}`,
      callerName: data.callerName,
      callerNumber: data.callerNumber,
      relationship: data.relationship,
      purpose: data.purpose,
      urgency: data.urgency || 'normal',
      timestamp: data.timestamp || 'Just now',
      secondsRemaining: currentTeacher.callSettings.timeoutSeconds || 15,
      status: 'pending'
    };
    setPendingApprovals((prev) => [approval, ...prev]);
    return approval;
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
    setCurrentTeacherId('teacher_sunita');
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
        addNewTeacher,
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
