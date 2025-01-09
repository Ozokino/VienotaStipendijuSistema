import { Component } from '@angular/core';
import { ScholarshipService } from '../../services/scholarship.service';
import { ApplicationService } from '../../services/application.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'stipendo-sponsor-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sponsor-dashboard.component.html',
  styleUrl: './sponsor-dashboard.component.scss'
})
export class SponsorDashboardComponent {
  scholarships: any[] = [];
  applications: any[] = [];
  selectedScholarship: any = null;

  constructor(
    private scholarshipService: ScholarshipService,
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    this.loadScholarships();
  }

  // Ielādē sponsora stipendijas
  loadScholarships(): void {
    this.scholarshipService.getMyScholarships().subscribe({
      next: (data) => (this.scholarships = data),
      error: (err) => console.error('Kļūda, ielādējot stipendijas:', err),
    });
  }

  // Skatīt konkrētas stipendijas pieteikumus
  viewApplications(scholarshipId: string): void {
    this.scholarshipService.getScholarshipById(scholarshipId).subscribe({
      next: (scholarship) => {
        this.selectedScholarship = scholarship;
        this.loadApplications(scholarshipId);
      },
      error: (err) => console.error('Kļūda, ielādējot stipendiju:', err),
    });
  }

  // Ielādē pieteikumus stipendijai
  loadApplications(scholarshipId: string): void {
    this.applicationService.getScholarshipApplications(scholarshipId).subscribe({
      next: (data) => (this.applications = data),
      error: (err) => console.error('Kļūda, ielādējot pieteikumus:', err),
    });
  }

  // Apstiprina pieteikumu
  approveApplication(applicationId: string): void {
    this.applicationService.updateApplicationStatus(applicationId, 'approved').subscribe({
      next: () => this.loadApplications(this.selectedScholarship._id),
      error: (err) => console.error('Kļūda, apstiprinot pieteikumu:', err),
    });
  }

  // Noraida pieteikumu
  rejectApplication(applicationId: string): void {
    this.applicationService.updateApplicationStatus(applicationId, 'rejected').subscribe({
      next: () => this.loadApplications(this.selectedScholarship._id),
      error: (err) => console.error('Kļūda, noraidot pieteikumu:', err),
    });
  }

  // Rediģē stipendiju
  editScholarship(scholarshipId: string): void {
    console.log('Navigācija uz rediģēšanas lapu:', scholarshipId);
  }

  // Dzēš stipendiju
  deleteScholarship(scholarshipId: string): void {
    this.scholarshipService.deleteScholarship(scholarshipId).subscribe({
      next: () => this.loadScholarships(),
      error: (err) => console.error('Kļūda, dzēšot stipendiju:', err),
    });
  }
}
