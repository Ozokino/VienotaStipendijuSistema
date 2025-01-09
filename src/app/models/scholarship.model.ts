export interface Scholarship {
    _id: string;
    title: string;
    studyProgram: string; 
    description: string;
    type: string; // one-time or monthly
    amount: number;
    requirements: string;
    creator: string;
    status: 'pending'| 'approved'| 'rejected';
    deadline:string;

    
}
export type TempScholarchip = Omit <Scholarship, '_id'>
