export type Section = 'Pre-Primary' | 'Primary';

export const CLASS_BY_SECTION: Record<Section, readonly string[]> = {
    'Pre-Primary': ['Pre A', 'Pre B', 'Pre C'],
    'Primary': ['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5', 'Level 6', 'Level 7'],
} as const;

export const SUBJECTS_BY_SECTION: Record<Section, readonly string[]> = {
    'Pre-Primary': ['Number', 'Social Development', 'Oral', 'Health Habits', 'Writing'],
    'Primary': ['Mathematics', 'English', 'Science', 'Social Studies'],
} as const;

export const getClassesBySection = (section: Section) =>{
    return CLASS_BY_SECTION[section] || [];
}

export const getSubjectsBySection = (section: Section) =>{
    return SUBJECTS_BY_SECTION[section] || [];
}


export type InterviewStatus = 'Pending' | 'Completed' | 'Reviewed';

export interface Interview {
    id: number;
    firstName: string;
    lastName: string;
    otherNames: string;
    previousSchool: string;
    section: Section;
    class: string;
    subject: string;
    score: number;  // ⚠️ Notice: It's a string in your DB, not a number!
    status: string;
    issuedBy: string;
    feedback: string;
    createdAt: Date;  // ISO date string from DB
}

// For creating new interviews (without id and createdAt)
export interface CreateInterviewDTO {
    firstName: string;
    lastName: string;
    otherNames: string;
    previousSchool: string;
    section: string;
    class: string;
    subject: string;
    score?: number;
    status: string;
    issuedBy: string;
    feedback?: string;
}

// For updates (all fields optional except id)
export interface UpdateInterviewDTO {
    id: number;
    firstName?: string;
    lastName?: string;
    otherNames?: string;
    previousSchool?: string;
    section?: string;
    class?: string;
    subject?: string;
    score?: number;
    status?: string;
    issuedBy?: string;
    feedback?: string;
}

export interface InterviewScoreDTO{
    id: number;
    score: number; 
    status?: string;
    feedback?: string;
}