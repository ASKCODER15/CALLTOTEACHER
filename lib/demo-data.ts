import { TeacherAccount } from './types';

export const INITIAL_TEACHERS: TeacherAccount[] = [
  {
    id: 'teacher_sunita',
    name: 'Mrs. Sunita Verma',
    category: 'Science & Physics Educator',
    email: 'sunita.verma@calltoteach.in',
    avatar: 'SV',
    profile: {
      className: 'Verma Science Tutorial',
      tagline: 'Concept-First Physics & General Science',
      teacherName: 'Mrs. Sunita Verma (M.Sc. Physics, 14+ yrs exp)',
      category: 'Science & Physics',
      qualification: 'M.Sc. Physics, B.Ed',
      experienceYears: 14,
      phone: '+91 98220 12345',
      location: 'Civil Lines, Near Model High School',
      city: 'Nagpur',
      pincode: '440001',
      grades: ['Class 9 Science', 'Class 10 Board Prep', 'Class 11 & 12 Physics'],
      subjects: ['Physics', 'General Science', 'Conceptual Numericals'],
      feeStructure: [
        {
          gradeCategory: 'Class 9 & 10 Integrated Science',
          amount: '₹2,500',
          billingCycle: 'per month',
          details: 'Includes daily practice problem sheets, lab demonstrations, and Sunday chapter tests.'
        },
        {
          gradeCategory: 'Class 11 & 12 Physics Board + Foundation',
          amount: '₹4,000',
          billingCycle: 'per month',
          details: 'In-depth derivations, formula handbooks, and past 10-year question bank drills.'
        }
      ],
      batches: [
        {
          id: 'b1',
          name: 'Class 10 Board Masterclass',
          timing: '04:30 PM - 06:00 PM',
          grades: 'Class 10 Board',
          days: 'Mon to Sat',
          seatsTotal: 18,
          seatsLeft: 3
        },
        {
          id: 'b2',
          name: 'Class 12 Physics Mechanics & Optics',
          timing: '06:15 PM - 07:45 PM',
          grades: 'Class 12 Physics',
          days: 'Mon, Wed, Fri',
          seatsTotal: 16,
          seatsLeft: 2
        }
      ],
      teachingHours: {
        start: '16:00',
        end: '21:00',
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      },
      admissionsPolicy: '2 free demo classes are offered to prospective students prior to batch enrollment.',
      faqs: [
        {
          id: 'faq1',
          question: 'Are demo or trial classes available?',
          answer: 'Yes, 2 free trial classes are offered so the student can evaluate teaching clarity before joining.'
        },
        {
          id: 'faq2',
          question: 'What is the fee for Class 10 science coaching?',
          answer: 'Class 10 monthly tuition is ₹2,500 per month including study materials and weekly mock tests.'
        },
        {
          id: 'faq3',
          question: 'What are the evening batch timings?',
          answer: 'Evening batches run between 4:30 PM and 7:45 PM Monday through Saturday.'
        }
      ]
    },
    trustedContacts: [
      {
        id: 'tc1',
        name: 'Dr. Anand Verma',
        phone: '+91 98221 23456',
        relationship: 'Spouse',
        transferPermission: 'during_teaching',
        notes: 'Husband (Physician). Show 1-tap screen alert during teaching hours; ring immediately outside class.',
        createdAt: '2026-01-10'
      },
      {
        id: 'tc2',
        name: 'Principal Dr. R. K. Deshmukh',
        phone: '+91 98225 99887',
        relationship: 'School Principal',
        transferPermission: 'always',
        notes: 'School Principal. Always route or ring through immediately.',
        createdAt: '2026-01-12'
      },
      {
        id: 'tc3',
        name: 'Little Angels School Reception',
        phone: '+91 712 2544 1100',
        relationship: 'Child School',
        transferPermission: 'always',
        notes: 'Daughter school desk. Always prioritize and route without delay.',
        createdAt: '2026-02-15'
      },
      {
        id: 'tc4',
        name: 'Ramesh (Printing & Stationer)',
        phone: '+91 94220 55441',
        relationship: 'Lab Assistant',
        transferPermission: 'never',
        notes: 'Study material printer. Never interrupt active class; AI takes note or message.',
        createdAt: '2026-02-01'
      }
    ],
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
    callHistory: [
      {
        id: 'call_sv_1',
        callerName: 'Mrs. Neha Kulkarni',
        callerNumber: '+91 98901 22334',
        isSyntheticDemo: true,
        category: 'parent_inquiry',
        callerType: 'Prospective Parent (10th Board)',
        timestamp: 'Today, 05:14 PM',
        durationSeconds: 94,
        reason: 'Inquired about Class 10 Board batch fees, timings, and demo class availability.',
        summary: 'Quoted Class 10 fee (₹2,500/mo) and batch time (4:30 PM). Booked trial demo for tomorrow.',
        outcome: 'answered_by_ai',
        followUpStatus: 'needs_callback',
        aiTranscript: [
          { speaker: 'Caller', text: 'Namaste ma\'am, Class 10 Science batch ke baare me puchhna tha. Fees aur timing kya hai?', time: '0:02' },
          { speaker: 'AI Receptionist', text: 'Namaste! Sunita ma\'am abhi ongoing batch me teach kar rahi hain. Class 10 Board batch ki monthly fee ₹2,500 hai aur timing shaam 4:30 se 6:00 PM hai.', time: '0:12' },
          { speaker: 'Caller', text: 'Kya demo class attend kar sakte hain kal?', time: '0:25' },
          { speaker: 'AI Receptionist', text: 'Ji bilkul! 2 free demo classes available hain. Maine kal 4:30 PM demo slot note kar liya hai. Address SMS par bhej diya gaya hai.', time: '0:38' }
        ]
      },
      {
        id: 'call_sv_2',
        callerName: 'Dr. Anand Verma',
        callerNumber: '+91 98221 23456',
        isSyntheticDemo: true,
        category: 'trusted_contact',
        callerType: 'Spouse (Trusted Contact)',
        timestamp: 'Today, 06:12 PM',
        durationSeconds: 40,
        reason: 'Urgent family coordination regarding groceries and car keys.',
        summary: 'Caller matched Trusted Contact rule (Prompt during teaching). Teacher approved transfer on screen.',
        outcome: 'transferred',
        transferStatus: 'approved',
        followUpStatus: 'resolved',
        aiTranscript: [
          { speaker: 'Caller', text: 'Sunita se baat ho sakti hai kya? Just 30 seconds kaam tha.', time: '0:02' },
          { speaker: 'AI Receptionist', text: 'Namaste Dr. Anand. Sunita ma\'am lecture le rahi hain. Main screen par 1-tap approval prompt bhej raha hoon.', time: '0:08' },
          { speaker: 'Teacher', text: '[Teacher Approved Transfer on Screen: Connected Call]', time: '0:15' }
        ]
      },
      {
        id: 'call_sv_3',
        callerName: 'BlueDart Courier Associate',
        callerNumber: '+91 91234 56789',
        isSyntheticDemo: true,
        category: 'personal_call',
        callerType: 'Delivery Associate',
        timestamp: 'Today, 06:45 PM',
        durationSeconds: 50,
        reason: 'Book parcel delivery at classroom door.',
        summary: 'Personal caller requested transfer. Teacher declined due to active lecture; AI advised leaving parcel at guard desk.',
        outcome: 'message_taken',
        transferStatus: 'declined',
        followUpStatus: 'resolved',
        aiTranscript: [
          { speaker: 'Caller', text: 'Sunita Verma ji ka parcel hai, gate pe khada hoon.', time: '0:03' },
          { speaker: 'AI Receptionist', text: 'Ma\'am abhi lecture me hain. Kripya parcel security desk par submit kar dijiye.', time: '0:14' },
          { speaker: 'Caller', text: 'Theek hai, guard ke paas drop kar deta hoon.', time: '0:22' }
        ]
      },
      {
        id: 'call_sv_4',
        callerName: 'Unknown Caller',
        callerNumber: '+91 99887 66554',
        isSyntheticDemo: true,
        category: 'unclear_reason',
        callerType: 'Unknown Caller',
        timestamp: 'Yesterday, 07:15 PM',
        durationSeconds: 32,
        reason: 'Caller refused to state reason or student name.',
        summary: 'Unverified caller without clear intent. Call shielded from teacher; message request logged.',
        outcome: 'declined',
        transferStatus: 'declined',
        followUpStatus: 'needs_callback',
        aiTranscript: [
          { speaker: 'Caller', text: 'Sunita se direct baat karao abhi.', time: '0:02' },
          { speaker: 'AI Receptionist', text: 'Ma\'am active class me hain. Kripya student ka naam ya inquiry reason batayein taaki main connect kar saku.', time: '0:10' },
          { speaker: 'Caller', text: 'Baad me call karunga.', time: '0:20' }
        ]
      }
    ]
  },
  {
    id: 'teacher_rajesh',
    name: 'Prof. Rajesh Sharma',
    category: 'Mathematics Tutor',
    email: 'rajesh.sharma@calltoteach.in',
    avatar: 'RS',
    profile: {
      className: 'Maths Maestro Home & Batch Tutorials',
      tagline: 'Pure Mathematics & IIT JEE Problem Solving',
      teacherName: 'Prof. Rajesh Sharma (B.Tech IIT Delhi, 16 yrs exp)',
      category: 'Mathematics Tutor',
      qualification: 'B.Tech IIT Delhi, Author of Mastering Calculus',
      experienceYears: 16,
      phone: '+91 98110 44556',
      location: 'Sector 14 Market, Near DLF Phase 1',
      city: 'Gurugram',
      pincode: '122001',
      grades: ['Class 10 CBSE Board', 'Class 11 & 12 JEE Main & Advanced', 'Droppers Batch'],
      subjects: ['Algebra', 'Calculus', 'Coordinate Geometry', 'Trigonometry'],
      feeStructure: [
        {
          gradeCategory: 'Class 10 Board Excellence',
          amount: '₹3,000',
          billingCycle: 'per month',
          details: 'NCERT + Exemplar + RD Sharma advanced drills.'
        },
        {
          gradeCategory: 'Class 11 & 12 JEE Advanced Mentorship',
          amount: '₹5,500',
          billingCycle: 'per month',
          details: '3-hour weekly problem labs, past 20-year JEE archive solving.'
        }
      ],
      batches: [
        {
          id: 'rm1',
          name: 'IIT JEE Advanced Intensive',
          timing: '06:00 AM - 08:00 AM',
          grades: 'Class 12 & Droppers',
          days: 'Daily',
          seatsTotal: 15,
          seatsLeft: 2
        },
        {
          id: 'rm2',
          name: 'Class 11 Foundation Calculus',
          timing: '05:00 PM - 07:00 PM',
          grades: 'Class 11 JEE',
          days: 'Mon, Wed, Fri',
          seatsTotal: 18,
          seatsLeft: 4
        }
      ],
      teachingHours: {
        start: '15:30',
        end: '21:30',
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      },
      admissionsPolicy: 'Admission is based on a 45-minute basic mathematical diagnostic screening.',
      faqs: [
        {
          id: 'rf1',
          question: 'Are home tuition slots available?',
          answer: 'Yes, 1-on-1 personalized home tuition slots are available in Gurugram on weekend mornings.'
        },
        {
          id: 'rf2',
          question: 'What is the fee for JEE Advanced guidance?',
          answer: 'JEE Advanced batch is ₹5,500/month with individual test reviews and doubt solving.'
        }
      ]
    },
    trustedContacts: [
      {
        id: 'rtc1',
        name: 'Pooja Sharma',
        phone: '+91 98112 88990',
        relationship: 'Spouse',
        transferPermission: 'during_teaching',
        notes: 'Wife. Notify with 1-tap screen popup during class hours.',
        createdAt: '2026-01-05'
      },
      {
        id: 'rtc2',
        name: 'DPS School Coordinator',
        phone: '+91 124 4567 8900',
        relationship: 'Child School',
        transferPermission: 'always',
        notes: 'Son school desk. Immediate priority.',
        createdAt: '2026-01-18'
      }
    ],
    callSettings: {
      teachingHoursEnabled: true,
      teachingStart: '15:30',
      teachingEnd: '21:30',
      teachingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      aiLanguage: 'hinglish',
      aiVoiceTone: 'polite_formal',
      aiVoice: 'Deepak',
      aiModel: 'timbre-v2.5',
      aiSpeed: 1.0,
      personalCallApproval: 'always_ask',
      timeoutAction: 'whatsapp_callback',
      timeoutSeconds: 20,
      allowEmergencyBypass: true,
      sendWhatsappSummaryToTeacher: true,
      sendWhatsappConfirmationToCaller: true
    },
    callHistory: [
      {
        id: 'call_rs_1',
        callerName: 'Dr. Vivek Malhotra',
        callerNumber: '+91 98101 55667',
        isSyntheticDemo: true,
        category: 'parent_inquiry',
        callerType: 'Parent (Class 11 Student)',
        timestamp: 'Today, 05:40 PM',
        durationSeconds: 110,
        reason: 'Inquired about Class 11 JEE Advanced calculus batch and diagnostic test schedule.',
        summary: 'Shared syllabus focus and fee structure (₹5,500/mo). Scheduled diagnostic test for Saturday 11 AM.',
        outcome: 'answered_by_ai',
        followUpStatus: 'needs_callback',
        aiTranscript: [
          { speaker: 'Caller', text: 'Hello, I want to enroll my son in Prof. Sharma\'s Class 11 JEE batch.', time: '0:02' },
          { speaker: 'AI Receptionist', text: 'Hello! Prof. Sharma is taking class right now. Class 11 JEE batch runs Mon, Wed, Fri from 5:00 PM to 7:00 PM. Admission includes a brief 45-minute logic test.', time: '0:14' },
          { speaker: 'Caller', text: 'Can he take the test this Saturday?', time: '0:28' },
          { speaker: 'AI Receptionist', text: 'Yes! Saturday 11:00 AM slot is reserved for your son. Details have been dispatched to your WhatsApp number.', time: '0:42' }
        ]
      }
    ]
  },
  {
    id: 'teacher_priya',
    name: 'Priya Natarajan',
    category: 'Music & Performing Arts',
    email: 'priya.music@calltoteach.in',
    avatar: 'PN',
    profile: {
      className: 'Sangeet Sadhana Classical Academy',
      tagline: 'Carnatic Vocal, Harmonium & Veena Tuition',
      teacherName: 'Priya Natarajan (Sangeet Vidwat, 12 yrs exp)',
      category: 'Music & Performing Arts',
      qualification: 'Vidwat in Carnatic Music, Madras Music Academy',
      experienceYears: 12,
      phone: '+91 98450 77889',
      location: 'Indiranagar 100ft Road',
      city: 'Bengaluru',
      pincode: '560038',
      grades: ['Beginner Swaravali', 'Geetham & Varnam', 'Advanced Krithis', 'Voice Culture'],
      subjects: ['Carnatic Vocal', 'Veena Practice', 'Raga Alapana', 'Talam & Laya'],
      feeStructure: [
        {
          gradeCategory: 'Beginner & Intermediate Vocal (8 classes/month)',
          amount: '₹3,200',
          billingCycle: 'per month',
          details: 'Individual shruti alignment, recorded riyaz tracks, and notation sheets.'
        },
        {
          gradeCategory: 'Advanced Concert Training (1-on-1)',
          amount: '₹6,000',
          billingCycle: 'per month',
          details: 'Manodharma sangeetham, kalpanaswaras, and stage performance readiness.'
        }
      ],
      batches: [
        {
          id: 'pm1',
          name: 'Junior Riyaz Morning Batch',
          timing: '07:00 AM - 08:30 AM',
          grades: 'Beginners & Kids',
          days: 'Tue, Thu, Sat',
          seatsTotal: 10,
          seatsLeft: 2
        },
        {
          id: 'pm2',
          name: 'Evening Varnam & Krithi Intensive',
          timing: '05:30 PM - 07:00 PM',
          grades: 'Intermediate',
          days: 'Mon to Fri',
          seatsTotal: 8,
          seatsLeft: 1
        }
      ],
      teachingHours: {
        start: '16:00',
        end: '20:30',
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      },
      admissionsPolicy: '15-minute shruti and rhythm assessment is conducted prior to batch placement.',
      faqs: [
        {
          id: 'pf1',
          question: 'Are classes conducted online or in-person?',
          answer: 'Both modes are available: in-person sessions at Indiranagar studio and 1-on-1 high-definition Zoom audio classes for outstation students.'
        },
        {
          id: 'pf2',
          question: 'What is the minimum age for kids to start vocal training?',
          answer: 'Children starting from age 6 can join the Junior Riyaz batch.'
        }
      ]
    },
    trustedContacts: [
      {
        id: 'ptc1',
        name: 'Karthik Natarajan',
        phone: '+91 98451 11223',
        relationship: 'Spouse',
        transferPermission: 'during_teaching',
        notes: 'Husband. 1-tap screen alert.',
        createdAt: '2026-02-01'
      }
    ],
    callSettings: {
      teachingHoursEnabled: true,
      teachingStart: '16:00',
      teachingEnd: '20:30',
      teachingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      aiLanguage: 'english',
      aiVoiceTone: 'warm_respectful',
      personalCallApproval: 'always_ask',
      timeoutAction: 'take_message',
      timeoutSeconds: 15,
      allowEmergencyBypass: true,
      sendWhatsappSummaryToTeacher: true,
      sendWhatsappConfirmationToCaller: true
    },
    callHistory: [
      {
        id: 'call_pn_1',
        callerName: 'Meenakshi Sundaram',
        callerNumber: '+91 98402 33445',
        isSyntheticDemo: true,
        category: 'parent_inquiry',
        callerType: 'Parent of 8-year-old',
        timestamp: 'Today, 06:10 PM',
        durationSeconds: 82,
        reason: 'Inquired about beginner Carnatic vocal batch and vocal trial slot.',
        summary: 'Answered junior batch schedule (Tue/Thu/Sat 7 AM) and fee (₹3,200/mo). Booked assessment slot.',
        outcome: 'answered_by_ai',
        followUpStatus: 'needs_callback',
        aiTranscript: [
          { speaker: 'Caller', text: 'Hello, I want to inquire about vocal classes for my 8-year-old daughter.', time: '0:02' },
          { speaker: 'AI Receptionist', text: 'Hello! Ms. Priya is conducting a music session currently. Our Junior Riyaz batch runs Tue, Thu, Sat from 7:00 AM to 8:30 AM at ₹3,200/month.', time: '0:14' },
          { speaker: 'Caller', text: 'Can we come for a 15-minute voice assessment tomorrow?', time: '0:26' },
          { speaker: 'AI Receptionist', text: 'Certainly! I have reserved a 15-minute assessment slot tomorrow at 5:00 PM. Studio location details have been sent to your WhatsApp.', time: '0:39' }
        ]
      }
    ]
  },
  {
    id: 'teacher_ananya',
    name: 'Ananya Sen',
    category: 'English & Language Coach',
    email: 'ananya.sen@calltoteach.in',
    avatar: 'AS',
    profile: {
      className: 'Apex English & IELTS Academy',
      tagline: 'Fluency, Creative Writing & IELTS Academic 8.0+',
      teacherName: 'Ananya Sen (M.A. English Literature, CELTA)',
      category: 'English & Language',
      qualification: 'M.A. English, Cambridge CELTA Certified',
      experienceYears: 10,
      phone: '+91 98300 88990',
      location: 'Salt Lake Sector 1',
      city: 'Kolkata',
      pincode: '700064',
      grades: ['Class 10 & 12 ICSE/CBSE English', 'IELTS Academic', 'Spoken English & Debate'],
      subjects: ['English Literature', 'Essay & Précis Writing', 'Grammar Mastery', 'IELTS Speaking'],
      feeStructure: [
        {
          gradeCategory: 'ICSE/CBSE Board Literature & Grammar',
          amount: '₹2,800',
          billingCycle: 'per month',
          details: 'Detailed line-by-line drama & poem analysis, sample answers, and mock tests.'
        },
        {
          gradeCategory: 'IELTS Academic Intensive (6-week crash)',
          amount: '₹7,500',
          billingCycle: 'one-time',
          details: 'Full mock reading/listening evaluations and 10 personal speaking interviews.'
        }
      ],
      batches: [
        {
          id: 'as1',
          name: 'IELTS Speaking & Writing Lab',
          timing: '06:00 PM - 07:30 PM',
          grades: 'IELTS Aspirants',
          days: 'Mon, Wed, Fri',
          seatsTotal: 12,
          seatsLeft: 3
        }
      ],
      teachingHours: {
        start: '16:00',
        end: '21:00',
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      },
      admissionsPolicy: 'Free diagnostic language placement test is evaluated prior to batch enrollment.',
      faqs: [
        {
          id: 'af1',
          question: 'Do you help with ICSE Board drama and poetry answer writing?',
          answer: 'Yes, special answer keys with historical context and character analysis are provided for ICSE Class 9 & 10.'
        }
      ]
    },
    trustedContacts: [],
    callSettings: {
      teachingHoursEnabled: true,
      teachingStart: '16:00',
      teachingEnd: '21:00',
      teachingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      aiLanguage: 'english',
      aiVoiceTone: 'polite_formal',
      personalCallApproval: 'always_ask',
      timeoutAction: 'whatsapp_callback',
      timeoutSeconds: 15,
      allowEmergencyBypass: true,
      sendWhatsappSummaryToTeacher: true,
      sendWhatsappConfirmationToCaller: true
    },
    callHistory: []
  }
];

export const DEMO_LEARNING_CENTRE_PROFILE = {
  className: 'Demo Learning Centre',
  teacherName: 'Prof. Amit Verma',
  subjects: ['Mathematics', 'Science (Physics & Chemistry)'],
  grades: ['Class 9', 'Class 10 (CBSE & State Board)'],
  feeStructure: [
    { course: 'Class 9 Maths & Science', fee: '₹3,000 per month' },
    { course: 'Class 10 Board Batch', fee: '₹3,500 per month' },
    { course: 'One-on-One Doubt Session', fee: '₹1,000 per session' }
  ],
  timings: [
    { batch: 'Class 9 Regular', days: 'Mon, Wed, Fri', time: '4:30 PM to 6:00 PM' },
    { batch: 'Class 10 Board Prep', days: 'Tue, Thu, Sat', time: '6:00 PM to 7:30 PM' },
    { batch: 'Sunday Tests', days: 'Sunday', time: '10:00 AM to 12:00 PM' }
  ],
  location: 'Shivaji Nagar, Pune',
  admissionsPolicy: '2 free demo trial classes before enrollment. No admission or registration fee.',
  faqs: [
    {
      question: 'Are demo classes available?',
      answer: 'Yes, 2 free demo classes are offered before admission.'
    },
    {
      question: 'What is the batch size?',
      answer: 'Maximum 15 students per batch for personal attention.'
    },
    {
      question: 'Do you provide study notes?',
      answer: 'Yes, printed DPPs and formula sheets are included in the tuition fee.'
    }
  ]
};

