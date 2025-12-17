export type Section = 'Pre-Primary' | 'Primary';

export const CLASS_BY_SECTION: Record<Section, readonly string[]> = {
  'Pre-Primary': ['Pre A', 'Pre B', 'Pre C'],
  'Primary': [
    'Level 1',
    'Level 2',
    'Level 3',
    'Level 4',
    'Level 5',
    'Level 6',
    'Level 7',
  ],
} as const;

export const SUBJECTS_BY_SECTION: Record<Section, readonly string[]> = {
  'Pre-Primary': ['Number', 'Social Development', 'Oral', 'Health Habits', 'Writing'],
  'Primary': ['Mathematics', 'English', 'Science', 'Social Studies'],
} as const;

export const getClassesBySection = (section: Section) =>
  CLASS_BY_SECTION[section];

export const getSubjectsBySection = (section: Section) =>
  SUBJECTS_BY_SECTION[section];

export type InterviewStatus = 'Pending' | 'Passed' | 'Failed';

export interface Interview {
  id: string;                 // MongoDB ID
  firstName: string;
  lastName: string;
  otherNames: string;
  previousSchool: string;
  section: Section;
  class: string;
  subject: string;
  score: number;
  status: InterviewStatus;
  issuedBy: string;
  feedback: string;
  createdAt: string;           // ISO string from backend
}


// For creating new interviews (without id and createdAt)
export interface CreateInterviewDTO {
  firstName: string;
  lastName: string;
  otherNames?: string;
  previousSchool: string;
  section: Section;
  class: string;
  subject: string;
  score?: number;
  status?: InterviewStatus;   // backend default = Pending
  issuedBy: string;
  feedback?: string;
}


// For updates (all fields optional except id)
export interface UpdateInterviewDTO {
  id: string;
  firstName?: string;
  lastName?: string;
  otherNames?: string;
  previousSchool?: string;
  section?: Section;
  class?: string;
  subject?: string;
  score?: number;
  status?: InterviewStatus;
  issuedBy?: string;
  feedback?: string;
}


export interface InterviewScoreDTO {
  id: string;
  score: number;
  status?: Exclude<InterviewStatus, 'Pending'>;
  feedback?: string;
}
