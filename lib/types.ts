export type TransferPermission = 'always' | 'during_teaching' | 'never';

export type CallCategory = 'parent_inquiry' | 'trusted_contact' | 'personal_call' | 'delivery_service' | 'spam_filtered';

export type CallOutcome = 'answered_by_ai' | 'transferred' | 'message_taken' | 'callback_scheduled' | 'declined';

export type FollowUpStatus = 'needs_callback' | 'callback_done' | 'form_sent' | 'resolved';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface ClassBatch {
  id: string;
  name: string;
  timing: string;
  grades: string;
  days: string;
  seatsTotal: number;
  seatsLeft: number;
}

export interface ClassProfile {
  className: string;
  tagline: string;
  teacherName: string;
  qualification: string;
  experienceYears: number;
  phone: string;
  location: string;
  city: string;
  pincode: string;
  grades: string[];
  subjects: string[];
  feeStructure: {
    gradeCategory: string;
    amount: string;
    billingCycle: string;
    details: string;
  }[];
  batches: ClassBatch[];
  teachingHours: {
    start: string; // "16:00"
    end: string; // "21:30"
    days: string[]; // ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  };
  faqs: FAQItem[];
}

export interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  relationship: 'Spouse' | 'Parent' | 'Child School' | 'School Principal' | 'Co-Teacher' | 'Lab Assistant' | 'Accountant' | 'Doctor' | 'Friend' | 'Other';
  transferPermission: TransferPermission;
  notes: string;
  avatarSeed?: string;
  createdAt: string;
}

export interface CallSettings {
  teachingHoursEnabled: boolean;
  teachingStart: string; // "16:00"
  teachingEnd: string; // "21:30"
  teachingDays: string[];
  aiLanguage: 'hinglish' | 'hindi' | 'english' | 'marathi' | 'gujarati';
  aiVoiceTone: 'warm_respectful' | 'polite_formal' | 'quick_direct';
  personalCallApproval: 'always_ask' | 'strict_screen' | 'auto_callback';
  timeoutAction: 'take_message' | 'whatsapp_callback' | 'urgent_sms';
  timeoutSeconds: number;
  allowEmergencyBypass: boolean;
  sendWhatsappSummaryToTeacher: boolean;
  sendWhatsappConfirmationToCaller: boolean;
}

export interface CallLogItem {
  id: string;
  callerName: string;
  callerNumber: string;
  isSyntheticDemo: true;
  category: CallCategory;
  callerType: string;
  timestamp: string;
  durationSeconds: number;
  reason: string;
  summary: string;
  aiTranscript: {
    speaker: 'Caller' | 'CallSetu AI' | 'Teacher';
    text: string;
    time: string;
  }[];
  outcome: CallOutcome;
  transferStatus?: 'approved' | 'declined' | 'timed_out' | 'not_requested';
  followUpStatus: FollowUpStatus;
  notes?: string;
}

export interface TeacherAccount {
  id: string;
  name: string;
  email: string;
  avatar: string;
  profile: ClassProfile;
  trustedContacts: TrustedContact[];
  callSettings: CallSettings;
  callHistory: CallLogItem[];
}

export interface PendingApproval {
  id: string;
  callId: string;
  callerName: string;
  callerNumber: string;
  relationship?: string;
  purpose: string;
  urgency: 'high' | 'normal';
  timestamp: string;
  secondsRemaining: number;
  status: 'pending' | 'approved' | 'declined' | 'timed_out';
}
