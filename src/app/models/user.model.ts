export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    institution?: string; 
    studyProgram?: string;
    role: 'student' | 'sponsor' | 'admin'; 
    sponsorVerificationStatus?: 'pending' | 'approved' | 'rejected';
    isVerified: boolean; 
    sessionToken: string; 
    password: string;
}


export type TempUser = Omit<User, '_id' | 'isVerified'>;
export type UserLoginModel = Omit<AuthenticatedUser, '_id' | 'firstName' | 'lastName' |'sessionToken'>;


export interface AuthenticatedUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'student' | 'sponsor' | 'admin';
    sessionToken: string; 
    password: string;
    sponsorVerificationStatus?: 'pending' | 'approved' | 'rejected';
}
export interface UserRole {
    role: string;
}