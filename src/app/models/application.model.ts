
export interface Application {
    _id: string;
    scholarshipId:  string;
    userId: string;
    motivationLetter: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: Date;
}
  