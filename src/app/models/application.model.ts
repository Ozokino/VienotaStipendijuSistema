export interface Scholarship {
    _id: string;
    title: string;
  }

export interface Application {
    _id: string; // Pieteikuma ID
    scholarshipId: Scholarship | string; // Saistītās stipendijas ID
    userId: string; // Lietotāja (studenta) ID, kas pieteicās
    motivationLetter: string; // Studenta motivācijas vēstule
    status: 'pending' | 'approved' | 'rejected'; // Pieteikuma statuss
    createdAt: Date; // Pieteikuma izveides datum
}
  