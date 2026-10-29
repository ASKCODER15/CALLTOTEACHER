import { TeacherAccount } from './types';

export const INITIAL_TEACHERS: TeacherAccount[] = [
  {
    id: 'teacher_bhavani',
    name: 'Mrs. Sunita Verma',
    email: 'sunita.verma@bhavaniscience.in',
    avatar: 'SV',
    profile: {
      className: 'Bhavani Science Classes',
      tagline: 'Strong Fundamentals, Confident Results (Class 8 to 12)',
      teacherName: 'Mrs. Sunita Verma (M.Sc. Physics, B.Ed)',
      qualification: 'M.Sc. Physics (Pune Univ), B.Ed, 14+ Years Experience',
      experienceYears: 14,
      phone: '+91 98220 98765', // Sample demo number
      location: 'Plot 42, 2nd Floor, Mayur Colony, Near Karve Statue, Kothrud',
      city: 'Pune',
      pincode: '411038',
      grades: ['Class 8 Science', 'Class 9 Science', 'Class 10 Board Prep', 'Class 11 Physics & Chem', 'Class 12 Board + NEET/JEE Foundation'],
      subjects: ['Physics', 'Chemistry', 'Biology', 'Mathematics Foundation'],
      feeStructure: [
        {
          gradeCategory: 'Class 8 & 9 (Combined Science + Maths)',
          amount: '₹2,200',
          billingCycle: 'per month',
          details: 'Includes DPP problem sheets, Sunday revision tests & practical demonstrations.'
        },
        {
          gradeCategory: 'Class 10 Board Intensive (All Sciences + Maths)',
          amount: '₹2,800',
          billingCycle: 'per month',
          details: 'NCERT thorough drill, past 10-year board paper discussions, 2 full mock board series.'
        },
        {
          gradeCategory: 'Class 11 & 12 Physics & Chemistry Special',
          amount: '₹4,500',
          billingCycle: 'per month',
          details: 'Boards + NEET/JEE fundamental concept modules, small batch of max 18 students.'
        },
        {
          gradeCategory: 'One-Time Registration / Material Fee',
          amount: '₹600',
          billingCycle: 'one-time',
          details: 'Includes printed formula handbook, test access portal, and batch bag.'
        }
      ],
      batches: [
        {
          id: 'b1',
          name: 'Morning Board Masterclass',
          timing: '06:30 AM - 08:00 AM',
          grades: 'Class 12 Physics (State & CBSE)',
          days: 'Mon, Wed, Fri',
          seatsTotal: 18,
          seatsLeft: 3
        },
        {
          id: 'b2',
          name: 'Class 10 Board Focus Batch A',
          timing: '04:30 PM - 06:00 PM',
          grades: 'Class 10 Board Prep',
          days: 'Mon to Sat',
          seatsTotal: 20,
          seatsLeft: 4
        },
        {
          id: 'b3',
          name: 'Class 9 Science Foundation',
          timing: '06:15 PM - 07:30 PM',
          grades: 'Class 9 CBSE/ICSE',
          days: 'Mon, Tue, Thu, Fri',
          seatsTotal: 18,
          seatsLeft: 6
        },
        {
          id: 'b4',
          name: 'Class 11 NEET/JEE Concept Lab',
          timing: '07:45 PM - 09:15 PM',
          grades: 'Class 11 Science',
          days: 'Tue, Thu, Sat',
          seatsTotal: 16,
          seatsLeft: 2
        }
      ],
      teachingHours: {
        start: '16:00',
        end: '21:30',
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      },
      faqs: [
        {
          id: 'faq1',
          question: 'Are demo or trial classes available for new admissions?',
          answer: 'Yes! We provide 2 free demo classes so the student and parents can experience teaching clarity and classroom environment before confirming enrollment.'
        },
        {
          id: 'faq2',
          question: 'What is the maximum batch size at Bhavani Science Classes?',
          answer: 'We strictly maintain a maximum limit of 18 to 20 students per batch to ensure individual attention and regular one-on-one doubt clarification.'
        },
        {
          id: 'faq3',
          question: 'Is printed study material and test series included in the fee?',
          answer: 'Yes. Daily Practice Problem (DPP) worksheets, chapter-wise summary handbooks, and weekly Sunday tests are fully included in the monthly fee.'
        },
        {
          id: 'faq4',
          question: 'Which educational boards do you cater to?',
          answer: 'We cover CBSE, ICSE, and Maharashtra State Board with special emphasis on NCERT mastery and step-by-step board answer writing.'
        },
        {
          id: 'faq5',
          question: 'Where is the coaching center located and what are landmark directions?',
          answer: 'We are located at Plot 42, 2nd Floor, Mayur Colony, Kothrud, Pune. Just a 2-minute walk from Karve Statue and Metro Pillar 42.'
        },
        {
          id: 'faq6',
          question: 'Can parents speak directly to Mrs. Sunita Verma?',
          answer: 'Parent meetings are scheduled on Saturdays between 11:00 AM to 01:00 PM or after 09:30 PM by prior appointment, so active class time is not interrupted.'
        }
      ]
    },
    trustedContacts: [
      {
        id: 'tc1',
        name: 'Dr. Anand Verma',
        phone: '+91 98221 23456', // Demo synthetic
        relationship: 'Spouse',
        transferPermission: 'during_teaching',
        notes: 'Husband (Physician). Transfer call if urgent or during break; otherwise take quick note.',
        createdAt: '2026-01-10'
      },
      {
        id: 'tc2',
        name: 'Principal Dr. R. K. Deshmukh',
        phone: '+91 98225 99887', // Demo synthetic
        relationship: 'School Principal',
        transferPermission: 'always',
        notes: 'Principal at Modern Vidya Mandir school. Always route or alert immediately.',
        createdAt: '2026-01-12'
      },
      {
        id: 'tc3',
        name: 'Mahesh (Lab & Xerox Assistant)',
        phone: '+91 94220 55441', // Demo synthetic
        relationship: 'Lab Assistant',
        transferPermission: 'never',
        notes: 'Handles test paper printing & apparatus. CallSetu takes message; no phone transfer during class.',
        createdAt: '2026-02-01'
      },
      {
        id: 'tc4',
        name: 'Little Angels School Reception',
        phone: '+91 20 2544 1100', // Demo synthetic
        relationship: 'Child School',
        transferPermission: 'always',
        notes: 'Daughter Sneha school desk. Urgent emergency calls must ring through immediately.',
        createdAt: '2026-02-15'
      }
    ],
    callSettings: {
      teachingHoursEnabled: true,
      teachingStart: '16:00',
      teachingEnd: '21:30',
      teachingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      aiLanguage: 'hinglish',
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
        id: 'call_101',
        callerName: 'Mrs. Neha Kulkarni (Parent)',
        callerNumber: '+91 98901 22334',
        isSyntheticDemo: true,
        category: 'parent_inquiry',
        callerType: 'New Parent (10th Board)',
        timestamp: 'Today, 05:14 PM',
        durationSeconds: 98,
        reason: 'Inquired about Class 10 Board batch fees, timing and demo class.',
        summary: 'Answered Class 10 fee (₹2,800/mo), batch time (4:30 PM) and offered 2 free demo classes. Parent booked trial for tomorrow 4:30 PM.',
        outcome: 'answered_by_ai',
        followUpStatus: 'form_sent',
        aiTranscript: [
          { speaker: 'Caller', text: 'Namaste ma\'am, I wanted to ask about Class 10 science coaching for my daughter.', time: '0:02' },
          { speaker: 'CallSetu AI', text: 'Namaste! Sunita ma\'am abhi Class 10 batch me teach kar rahi hain. Main unka CallSetu AI assistant hoon. Class 10 Board intensive batch Mon-Sat 4:30 PM to 6:00 PM chalti hai.', time: '0:12' },
          { speaker: 'Caller', text: 'Achha, fees kitni hai per month?', time: '0:22' },
          { speaker: 'CallSetu AI', text: 'Class 10 Board batch ki monthly fee ₹2,800 hai, jisme Daily Practice sheets aur Sunday board tests included hain. Kya aap 2 free demo classes attend karwana chahengi?', time: '0:35' },
          { speaker: 'Caller', text: 'Haan, kal bhej sakti hoon 4:30 baje?', time: '0:48' },
          { speaker: 'CallSetu AI', text: 'Bilkul! Maine kal shaam 4:30 PM demo slot note kar liya hai. Center location Mayur Colony Kothrud, near Karve Statue hai. Address aapko SMS/WhatsApp par bhej diya gaya hai.', time: '0:58' }
        ]
      },
      {
        id: 'call_102',
        callerName: 'Dr. Anand Verma',
        callerNumber: '+91 98221 23456',
        isSyntheticDemo: true,
        category: 'trusted_contact',
        callerType: 'Spouse (Trusted Contact)',
        timestamp: 'Today, 06:12 PM',
        durationSeconds: 42,
        reason: 'Checking if Sunita finished early or needed groceries picked up.',
        summary: 'Caller matched Trusted Contact rule (During Teaching Hours -> Approval Required). Approval card displayed to teacher; teacher approved transfer.',
        outcome: 'transferred',
        transferStatus: 'approved',
        followUpStatus: 'resolved',
        aiTranscript: [
          { speaker: 'Caller', text: 'Sunita se baat ho sakti hai kya? Just 30 seconds kaam tha.', time: '0:02' },
          { speaker: 'CallSetu AI', text: 'Namaste Dr. Anand. Sunita ma\'am Class 9 batch me hain. Main screen par alert bhej raha hoon.', time: '0:09' },
          { speaker: 'Teacher', text: '[Teacher 1-Tap Approved Transfer: "Connecting Call now..."]', time: '0:18' }
        ]
      },
      {
        id: 'call_103',
        callerName: 'Amazon Delivery Associate',
        callerNumber: '+91 91234 56789',
        isSyntheticDemo: true,
        category: 'personal_call',
        callerType: 'Personal / Courier Service',
        timestamp: 'Today, 06:45 PM',
        durationSeconds: 55,
        reason: 'Parcel delivery at classroom gate.',
        summary: 'Unapproved caller claiming delivery. CallSetu asked purpose, teacher declined transfer due to ongoing lecture; AI instructed delivery agent to leave parcel with security guard.',
        outcome: 'message_taken',
        transferStatus: 'declined',
        followUpStatus: 'resolved',
        aiTranscript: [
          { speaker: 'Caller', text: 'Sunita Verma ji ka parcel hai gate pe khada hoon.', time: '0:04' },
          { speaker: 'CallSetu AI', text: 'Ma\'am abhi lecture le rahi hain. Parcel reception security guard Mr. Ramesh ke paas submit kar dijiye aur OTP unse le lijiye.', time: '0:15' },
          { speaker: 'Caller', text: 'Theek hai, guard ke paas drop kar deta hoon.', time: '0:25' }
        ]
      },
      {
        id: 'call_104',
        callerName: 'Mr. Arvind Shinde (Parent)',
        callerNumber: '+91 97654 32100',
        isSyntheticDemo: true,
        category: 'parent_inquiry',
        callerType: 'Enrolled Student Parent',
        timestamp: 'Yesterday, 07:20 PM',
        durationSeconds: 84,
        reason: 'Class 11 Chemistry doubt & missed test query.',
        summary: 'Parent asked about son Rohan missing Sunday test. AI informed makeup test will be held on Friday 5 PM, and logged request for Sunita ma\'am callback after 9:30 PM.',
        outcome: 'callback_scheduled',
        followUpStatus: 'needs_callback',
        aiTranscript: [
          { speaker: 'Caller', text: 'Namaste madam, Rohan ke father baat kar raha hoon. Sunday ko Rohan test nahi de paya tha fever ki wajah se.', time: '0:05' },
          { speaker: 'CallSetu AI', text: 'Namaste Shinde ji. Rohan ki tabiyat kaisi hai ab? Sunday missed test ka makeup batch Friday evening 5:00 PM schedule kiya gaya hai.', time: '0:18' },
          { speaker: 'Caller', text: 'Bohot achha. Sunita ma\'am se 2 minute baat karni thi unke progress ke baare me.', time: '0:30' },
          { speaker: 'CallSetu AI', text: 'Sunita ma\'am ka class 9:15 PM tak chalega. Maine unke callback queue me note daal diya hai, woh 9:30 PM par aapse baat karengi.', time: '0:42' }
        ]
      }
    ]
  },
  {
    id: 'teacher_rajesh',
    name: 'Prof. Rajesh Sharma',
    email: 'rajesh.sharma@mathsmaestro.in',
    avatar: 'RS',
    profile: {
      className: 'Maths Maestro Tutorials',
      tagline: 'Pure Mathematics & JEE Advanced Problem Solving',
      teacherName: 'Prof. Rajesh Sharma (B.Tech IIT-D, 16 yrs exp)',
      qualification: 'B.Tech IIT Delhi, Author of "Mastering Calculus"',
      experienceYears: 16,
      phone: '+91 98110 44556',
      location: 'SCO 84, 1st Floor, Sector 14 Market',
      city: 'Gurugram',
      pincode: '122001',
      grades: ['Class 9 Maths Foundation', 'Class 10 CBSE Board', 'Class 11 JEE Main + Adv', 'Class 12 JEE Advanced Droppers'],
      subjects: ['Pure Mathematics', 'Applied Calculus', 'Coordinate Geometry', 'Algebra'],
      feeStructure: [
        {
          gradeCategory: 'Class 9 & 10 Board Excellence',
          amount: '₹3,000',
          billingCycle: 'per month',
          details: 'Complete NCERT + Exemplar + RD Sharma advanced modules.'
        },
        {
          gradeCategory: 'Class 11 & 12 JEE Foundation & Advanced',
          amount: '₹5,500',
          billingCycle: 'per month',
          details: 'Rigorous 3-hour weekly problem solving labs + archive test series.'
        }
      ],
      batches: [
        {
          id: 'rm1',
          name: 'IIT JEE Advanced Dropper Intensive',
          timing: '07:00 AM - 09:30 AM',
          grades: '12th Pass / Repeaters',
          days: 'Daily',
          seatsTotal: 15,
          seatsLeft: 1
        },
        {
          id: 'rm2',
          name: 'Class 11 Calculus & Vectors',
          timing: '04:00 PM - 06:00 PM',
          grades: 'Class 11 JEE',
          days: 'Mon, Wed, Fri',
          seatsTotal: 18,
          seatsLeft: 5
        }
      ],
      teachingHours: {
        start: '15:30',
        end: '21:00',
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      },
      faqs: [
        {
          id: 'rf1',
          question: 'Does Prof. Rajesh teach personally or via assistants?',
          answer: 'All theory lectures, advanced drills, and paper reviews are personally conducted by Prof. Rajesh Sharma.'
        },
        {
          id: 'rf2',
          question: 'What is the screening process for Class 11 JEE batch?',
          answer: 'Students appear for a 45-minute basic mathematics logic diagnostic test to assign them to Foundation or Advanced Track.'
        }
      ]
    },
    trustedContacts: [
      {
        id: 'rtc1',
        name: 'Pooja Sharma (Wife)',
        phone: '+91 98112 88990',
        relationship: 'Spouse',
        transferPermission: 'during_teaching',
        notes: 'Wife. Notify with approval popup.',
        createdAt: '2026-01-05'
      }
    ],
    callSettings: {
      teachingHoursEnabled: true,
      teachingStart: '15:30',
      teachingEnd: '21:00',
      teachingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      aiLanguage: 'hinglish',
      aiVoiceTone: 'polite_formal',
      personalCallApproval: 'always_ask',
      timeoutAction: 'whatsapp_callback',
      timeoutSeconds: 20,
      allowEmergencyBypass: true,
      sendWhatsappSummaryToTeacher: true,
      sendWhatsappConfirmationToCaller: true
    },
    callHistory: []
  }
];
