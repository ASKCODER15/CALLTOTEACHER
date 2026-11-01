export type TransferPermission = 'always' | 'during_teaching' | 'never';

export type CallCategory = 'parent_inquiry' | 'trusted_contact' | 'personal_call' | 'unclear_reason';

export type CallOutcome = 'answered_by_ai' | 'transferred' | 'message_taken' | 'callback_scheduled' | 'declined';

export type FollowUpStatus = 'needs_callback' | 'callback_done' | 'resolved';

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

export interface FeeItem {
  gradeCategory: string;
  amount: string;
  billingCycle: string;
  details: string;
}

export type EducatorCategory =
  | 'Home Tuition'
  | 'Mathematics Tutor'
  | 'Science & Physics'
  | 'English & Language'
  | 'Music & Performing Arts'
  | 'Coaching Institute'
  | 'General Academics';

export interface ClassProfile {
  className: string;
  tagline: string;
  teacherName: string;
  category: EducatorCategory;
  qualification: string;
  experienceYears: number;
  phone: string;
  location: string;
  city: string;
  pincode: string;
  grades: string[];
  subjects: string[];
  feeStructure: FeeItem[];
  batches: ClassBatch[];
  teachingHours: {
    start: string; // e.g. "16:00"
    end: string; // e.g. "21:30"
    days: string[]; // ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  };
  admissionsPolicy: string;
  faqs: FAQItem[];
}

export interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  relationship: 'Spouse' | 'Parent' | 'Child School' | 'School Principal' | 'Co-Teacher' | 'Lab Assistant' | 'Accountant' | 'Doctor' | 'Friend' | 'Other';
  transferPermission: TransferPermission;
  notes: string;
  createdAt: string;
}

export interface CallSettings {
  teachingHoursEnabled: boolean;
  teachingStart: string; // "16:00"
  teachingEnd: string; // "21:30"
  teachingDays: string[];
  aiLanguage: 'hinglish' | 'hindi' | 'english' | 'marathi' | 'bengali' | 'tamil' | 'kannada' | string;
  aiVoiceTone: 'warm_respectful' | 'polite_formal' | 'quick_direct' | string;
  aiVoice?: string; // e.g. 'Nalini', 'Deepak', 'Chitra', 'Radhika', 'Roopesh', 'Farhan', 'Bhavna'
  aiModel?: string; // e.g. 'timbre-v2.5'
  aiSpeed?: number; // e.g. 1.0
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
    speaker: 'Caller' | 'AI Receptionist' | 'Teacher';
    text: string;
    time: string;
  }[];
  outcome: CallOutcome;
  transferStatus?: 'approved' | 'declined' | 'timed_out' | 'not_requested';
  followUpStatus: FollowUpStatus;
  notes?: string;
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

export interface TeacherAccount {
  id: string;
  name: string;
  category: string;
  email: string;
  avatar: string;
  profile: ClassProfile;
  trustedContacts: TrustedContact[];
  callSettings: CallSettings;
  callHistory: CallLogItem[];
}
