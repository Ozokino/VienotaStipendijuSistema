import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ScholarshipService } from '../../services/scholarship.service';
import { CommonModule } from '@angular/common';
import { Scholarship } from '../../models/scholarship.model';
import { Subject, takeUntil } from 'rxjs';
import { User } from '../../models/user.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'stipendo-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit{
  pendingSponsors: User[] = [];
  pendingScholarships: Scholarship[] = [];
  users: User[] = [];
  activeSection: 'sponsors' | 'scholarships' | 'users' = 'sponsors'; // Default section
  private destroy$: Subject<void> = new Subject<void>;
  users$ = this.userService.users$;

  constructor(
    private userService: UserService,
    private scholarshipService: ScholarshipService
  ) {}

  ngOnInit(): void {
    this.loadPendingSponsors();
    this.loadPendingScholarships();
    this.userService.getAllUsers().pipe(takeUntil(this.destroy$)).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSection(section: 'sponsors' | 'scholarships' | 'users'): void {
    this.activeSection = section;
  }

  loadPendingSponsors(): void {
    this.userService.getPendingSponsors().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => (this.pendingSponsors = data),
      error: (err) => console.error('Error loading sponsors:', err),
    });
  }
 loadPendingScholarships(): void {
    this.scholarshipService.getPendingScholarships().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => (this.pendingScholarships = data),
      error: (err) => console.error('Error loading scholarships:', err),
    });
  }

  approveSponsor(id: string): void {
    this.userService.approveASponsor(id, 'approved').subscribe({
      next: () => this.loadPendingSponsors(),
      error: (err) => console.error('Error approving sponsor:', err),
    });
  }

  rejectSponsor(id: string): void {
    this.userService.approveASponsor(id, 'rejected').subscribe({
      next: () => this.loadPendingSponsors(),
      error: (err) => console.error('Error rejecting sponsor:', err),
    });
  }

 
  approveScholarship(id: string): void {
    this.scholarshipService.approveAScholarship(id, 'approved').subscribe({
      next: () => this.loadPendingScholarships(),
      error: (err) => console.error('Error approving scholarship:', err),
    });
  }

  rejectScholarship(id: string): void {
    this.scholarshipService.approveAScholarship(id, 'rejected').subscribe({
      next: () => this.loadPendingScholarships(),
      error: (err) => console.error('Error rejecting scholarship:', err),
    });
  }

  loadUsers(): void {
    this.userService.getAllUsers().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => (this.users = data),
      error: (err) => console.error('Error loading users:', err),
    });
  }

  viewUserDetails(userId: string): void {
    console.log('Viewing user details for:', userId);
    // Implement navigation or modal logic here
  }

}
//  pendingSponsors: any[] = [];
//   pendingScholarships: any[] = [];
//   users: any[] = [];

//   constructor(
//     private userService: UserService,
//     private scholarshipService: ScholarshipService
//   ) { }

//   ngOnInit(): void {
//     this.loadPendingSponsors();
//     this.loadPendingScholarships();
//     this.loadUsers();
//   }

//   // Ielādē sponsoru sarakstu
//   loadPendingSponsors(): void {
//     this.userService.getPendingSponsors().subscribe({
//       next: (data) => (this.pendingSponsors = data),
//       error: (err) => console.error('Kļūda, ielādējot sponsorus:', err),
//     });
//   }
//   filterSponsors(event: Event): void {
//     const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
//     this.pendingSponsors = this.pendingSponsors.filter((sponsor) =>
//       sponsor.email.toLowerCase().includes(searchTerm)
//     );
//   }
//   // Apstiprina sponsoru
//   approveSponsor(id: string): void {
//     this.userService.approveSponsor(id, 'approved').subscribe({
//       next: () => this.loadPendingSponsors(),
//       error: (err) => console.error('Kļūda, apstiprinot sponsoru:', err),
//     });
//   }

//   // Noraida sponsoru
//   rejectSponsor(id: string): void {
//     this.userService.approveSponsor(id, 'rejected').subscribe({
//       next: () => this.loadPendingSponsors(),
//       error: (err) => console.error('Kļūda, noraidot sponsoru:', err),
//     });
//   }

//   // Ielādē stipendiju sarakstu
//   loadPendingScholarships(): void {
//     this.scholarshipService.getPendingScholarships().subscribe({
//       next: (data) => (this.pendingScholarships = data),
//       error: (err) => console.error('Kļūda, ielādējot stipendijas:', err),
//     });
//   }

//   // Apstiprina stipendiju
//   approveScholarship(id: string): void {
//     this.scholarshipService.approveScholarship(id, 'approved').subscribe({
//       next: () => this.loadPendingScholarships(),
//       error: (err) => console.error('Kļūda, apstiprinot stipendiju:', err),
//     });
//   }

//   // Noraida stipendiju
//   rejectScholarship(id: string): void {
//     this.scholarshipService.approveScholarship(id, 'rejected').subscribe({
//       next: () => this.loadPendingScholarships(),
//       error: (err) => console.error('Kļūda, noraidot stipendiju:', err),
//     });
//   }

//   // Ielādē lietotāju sarakstu
//   loadUsers(): void {
//     this.userService.getAllUsers().subscribe({
//       next: (data) => (this.users = data),
//       error: (err) => console.error('Kļūda, ielādējot lietotājus:', err),
//     });
//   }

//   // Rediģē lietotāju
//   editUser(id: string): void {
//     // Navigācija uz rediģēšanas lapu vai modal loga atvēršana
//     console.log('Rediģē lietotāju:', id);
//   }

//   // Dzēš lietotāju
//   deleteUser(id: string): void {
//     this.userService.deleteAUser(id).subscribe({
//       next: () => this.loadUsers(),
//       error: (err) => console.error('Kļūda, dzēšot lietotāju:', err),
//     });
//   }