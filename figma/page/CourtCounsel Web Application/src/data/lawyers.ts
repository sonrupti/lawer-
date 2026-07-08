export interface Lawyer {
  id: string
  name: string
  photo: string
  barNumber: string
  yearsOfPractice: number
  practiceAreas: string[]
  courts: string[]
  city: string
  state: string
  languages: string[]
  totalCases: number
  winRate: number
  performanceScore: number
  clientRating: number
  verified: boolean
  email: string
  phone: string
  education: { degree: string; institution: string; year: number }[]
  summary: string
  recentActivity: string
  avgCaseDuration: number
  landmarkJudgments: number
}

export const lawyers: Lawyer[] = [
  {
    id: '1',
    name: 'Adv. Priya Nanda',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&auto=format',
    barNumber: 'OHC-2009-0471',
    yearsOfPractice: 15,
    practiceAreas: ['Constitutional Law', 'Civil Rights', 'Public Interest'],
    courts: ['Odisha High Court', 'Supreme Court of India'],
    city: 'Cuttack',
    state: 'Odisha',
    languages: ['Odia', 'English', 'Hindi'],
    totalCases: 342,
    winRate: 71,
    performanceScore: 88,
    clientRating: 4.8,
    verified: true,
    email: 'priya.nanda@legalmail.in',
    phone: '+91 94370 12345',
    education: [
      { degree: 'LLM Constitutional Law', institution: 'Delhi University', year: 2010 },
      { degree: 'LLB', institution: 'Utkal University', year: 2009 },
    ],
    summary: 'Senior advocate specializing in constitutional matters and public interest litigation. Known for landmark judgments in civil liberties cases before the Odisha High Court and Supreme Court.',
    recentActivity: '3 days ago',
    avgCaseDuration: 14,
    landmarkJudgments: 7,
  },
  {
    id: '2',
    name: 'Adv. Rajesh Mohanty',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&auto=format',
    barNumber: 'OHC-2005-0182',
    yearsOfPractice: 19,
    practiceAreas: ['Criminal Law', 'Property', 'Family Law'],
    courts: ['Odisha High Court', 'Bhubaneswar District Court'],
    city: 'Bhubaneswar',
    state: 'Odisha',
    languages: ['Odia', 'English', 'Hindi'],
    totalCases: 518,
    winRate: 68,
    performanceScore: 84,
    clientRating: 4.6,
    verified: true,
    email: 'r.mohanty@advocatesodisha.in',
    phone: '+91 98765 43210',
    education: [
      { degree: 'LLB', institution: 'Berhampur University', year: 2005 },
    ],
    summary: 'Experienced criminal defense and property lawyer with over 500 cases argued before Odisha courts. Strong track record in complex criminal matters.',
    recentActivity: '1 day ago',
    avgCaseDuration: 18,
    landmarkJudgments: 3,
  },
  {
    id: '3',
    name: 'Adv. Sunita Das',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&auto=format',
    barNumber: 'OHC-2014-0837',
    yearsOfPractice: 10,
    practiceAreas: ['Corporate Law', 'Taxation', 'Mergers & Acquisitions'],
    courts: ['Odisha High Court', 'NCLT Cuttack'],
    city: 'Cuttack',
    state: 'Odisha',
    languages: ['Odia', 'English'],
    totalCases: 187,
    winRate: 79,
    performanceScore: 82,
    clientRating: 4.9,
    verified: true,
    email: 'sunita.das@corplaw.in',
    phone: '+91 90109 87654',
    education: [
      { degree: 'LLM Corporate Law', institution: 'NLSIU Bangalore', year: 2015 },
      { degree: 'LLB', institution: 'Utkal University', year: 2014 },
    ],
    summary: 'Corporate and taxation specialist with expertise in M&A transactions and NCLT proceedings. Trusted by major Odisha businesses for high-value corporate mandates.',
    recentActivity: '5 days ago',
    avgCaseDuration: 10,
    landmarkJudgments: 2,
  },
  {
    id: '4',
    name: 'Adv. Bikram Patra',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&auto=format',
    barNumber: 'OHC-2001-0094',
    yearsOfPractice: 23,
    practiceAreas: ['Land Acquisition', 'Revenue Law', 'Tribal Rights'],
    courts: ['Odisha High Court', 'Supreme Court of India', 'NGT'],
    city: 'Sambalpur',
    state: 'Odisha',
    languages: ['Odia', 'English', 'Hindi', 'Sambalpuri'],
    totalCases: 621,
    winRate: 65,
    performanceScore: 86,
    clientRating: 4.7,
    verified: true,
    email: 'bikram.patra@revlaw.in',
    phone: '+91 94381 55678',
    education: [
      { degree: 'LLB', institution: 'Sambalpur University', year: 2001 },
    ],
    summary: 'Veteran advocate known for landmark land rights and tribal welfare cases. Has argued before the National Green Tribunal on environmental and forest-rights matters.',
    recentActivity: '2 weeks ago',
    avgCaseDuration: 22,
    landmarkJudgments: 11,
  },
  {
    id: '5',
    name: 'Adv. Ananya Sahoo',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&auto=format',
    barNumber: 'OHC-2017-1102',
    yearsOfPractice: 7,
    practiceAreas: ['Family Law', 'Domestic Violence', 'Child Custody'],
    courts: ['Bhubaneswar Family Court', 'Odisha High Court'],
    city: 'Bhubaneswar',
    state: 'Odisha',
    languages: ['Odia', 'English', 'Bengali'],
    totalCases: 143,
    winRate: 74,
    performanceScore: 78,
    clientRating: 4.9,
    verified: true,
    email: 'ananya.sahoo@familylegal.in',
    phone: '+91 98330 76543',
    education: [
      { degree: 'LLB', institution: 'KIIT School of Law', year: 2017 },
    ],
    summary: 'Rising advocate with exceptional client care in sensitive family matters. Particular strength in domestic violence cases and child welfare proceedings.',
    recentActivity: '1 day ago',
    avgCaseDuration: 8,
    landmarkJudgments: 1,
  },
  {
    id: '6',
    name: 'Adv. Debashish Jena',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&auto=format',
    barNumber: 'OHC-2011-0659',
    yearsOfPractice: 13,
    practiceAreas: ['Labour Law', 'Service Matters', 'Employment'],
    courts: ['Odisha High Court', 'Central Administrative Tribunal'],
    city: 'Bhubaneswar',
    state: 'Odisha',
    languages: ['Odia', 'English', 'Hindi'],
    totalCases: 289,
    winRate: 72,
    performanceScore: 81,
    clientRating: 4.5,
    verified: false,
    email: 'djena@laborlaw.in',
    phone: '+91 96583 21456',
    education: [
      { degree: 'LLM Labour Law', institution: 'Utkal University', year: 2012 },
      { degree: 'LLB', institution: 'Utkal University', year: 2011 },
    ],
    summary: 'Labour and service-law practitioner with deep expertise in government service matters and Central Administrative Tribunal proceedings.',
    recentActivity: '1 week ago',
    avgCaseDuration: 16,
    landmarkJudgments: 4,
  },
]

export const practiceAreas = [
  'Constitutional Law', 'Criminal Law', 'Corporate Law', 'Civil Rights',
  'Family Law', 'Land Acquisition', 'Labour Law', 'Taxation', 'Property',
  'Tribal Rights', 'Public Interest', 'Revenue Law', 'Environmental Law',
]

export const courts = [
  'Odisha High Court', 'Supreme Court of India', 'Bhubaneswar District Court',
  'Cuttack District Court', 'Sambalpur District Court', 'NCLT Cuttack',
  'Central Administrative Tribunal', 'NGT', 'Bhubaneswar Family Court',
]
