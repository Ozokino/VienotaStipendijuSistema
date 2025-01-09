// Lietotāja interfeiss (Frontend modelis)
export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    university?: string; // Tikai studentiem
    studyProgram?: string;
    role: 'student' | 'sponsor' | 'admin'; // Lietotāja loma
    sponsorVerificationStatus?: 'pending' | 'approved' | 'rejected';
    isVerified: boolean; // Vai lietotājs ir verificēts
    sessionToken: string; // Sīkdatne/autentifikācijas token
    password: string;
}

// Pagaidu lietotāja interfeiss reģistrācijai (bez `_id`)
export type TempUser = Omit<User, '_id' | 'isVerified'>;
export type UserLoginModel = Omit<AuthenticatedUser, '_id' | 'firstName' | 'lastName' |'sessionToken'>;


// Lietotāja interfeiss autentifikācijas laikā
export interface AuthenticatedUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'student' | 'sponsor' | 'admin';
    sessionToken: string; // Sīkdatne/autentifikācijas token
    password: string;
    sponsorVerificationStatus?: 'pending' | 'approved' | 'rejected';
}
export interface UserRole {
    role: string;
}