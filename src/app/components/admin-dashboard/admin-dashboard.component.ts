import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ScholarshipService } from '../../services/scholarship.service';
import { CommonModule } from '@angular/common';
import { Scholarship } from '../../models/scholarship.model';
import { Subject, takeUntil } from 'rxjs';
import { User } from '../../models/user.model';
import { RouterLink } from '@angular/router';
import educationData from '../../../assets/educationData.json';

@Component({
  selector: 'stipendo-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  pendingSponsors: User[] = [];
  pendingScholarships: Scholarship[] = [];
  users: User[] = [];
  sortedUsers: User[] = [];
  institutions: string[] = educationData.institutions;
  studyPrograms: string[] = educationData.studyPrograms;
  activeSection: 'sponsors' | 'scholarships' | 'users' = 'sponsors'; 

  roleSorting: string[] = [];
  institutionSorting: string[] = [];
  studyProgramSorting: string[] = [];

  private destroy$: Subject<void> = new Subject<void>;
  users$ = this.userService.users$;

  constructor(
    private userService: UserService,
    private scholarshipService: ScholarshipService
  ) {}

  ngOnInit(): void {
    this.loadPendingSponsors();
    this.loadPendingScholarships();
    this.userService.getAllUsers().pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.users = data;
      this.sortedUsers = [...this.users];
    });
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
      error: (err) => console.error('Kļūda, ielādējot sponsorus:', err),
    });
  }

  loadPendingScholarships(): void {
    this.scholarshipService.getPendingScholarships().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => (this.pendingScholarships = data),
      error: (err) => console.error('Kļūda, ielādējot stipendijas:', err),
    });
  }

  approveSponsor(id: string): void {
    this.userService.approveASponsor(id, 'approved').subscribe({
      next: () => this.loadPendingSponsors(),
      error: (err) => console.error('Kļūda, apstiprinot sponsoru:', err),
    });
  }

  rejectSponsor(id: string): void {
    this.userService.approveASponsor(id, 'rejected').subscribe({
      next: () => this.loadPendingSponsors(),
      error: (err) => console.error('Kļūda, noraidot sponsoru:', err),
    });
  }

  approveScholarship(id: string): void {
    this.scholarshipService.approveAScholarship(id, 'approved').subscribe({
      next: () => this.loadPendingScholarships(),
      error: (err) => console.error('Kļūda, apstiprinot stipendiju:', err),
    });
  }

  rejectScholarship(id: string): void {
    this.scholarshipService.approveAScholarship(id, 'rejected').subscribe({
      next: () => this.loadPendingScholarships(),
      error: (err) => console.error('Kļūda, noraidot stipendiju:', err),
    });
  }

  onRoleChange(event: Event): void {
    const selectedOptions = Array.from((event.target as HTMLSelectElement).selectedOptions);
    this.roleSorting = selectedOptions.map((option) => option.value);
    console.log('Lomu atlase atjaunota:', this.roleSorting);
  }

  onInstitutionChange(event: Event): void {
    const selectedOptions = Array.from((event.target as HTMLSelectElement).selectedOptions);
    this.institutionSorting = selectedOptions.map((option) => option.value);
    console.log('Institūciju atlase atjaunota:', this.institutionSorting);
  }

  onStudyProgramChange(event: Event): void {
    const selectedOptions = Array.from((event.target as HTMLSelectElement).selectedOptions);
    this.studyProgramSorting = selectedOptions.map((option) => option.value);
    console.log('Studiju programmu atlase atjaunota:', this.studyProgramSorting);
  }

  sortUsers(): void {
    const roles = this.roleSorting.length ? this.roleSorting : [...new Set(this.users.map((u) => u.role))];
    const institutions = this.institutionSorting.length ? this.institutionSorting : this.institutions;
    const programs = this.studyProgramSorting.length ? this.studyProgramSorting : this.studyPrograms;

    console.log('Atlases kritēriji:', { roles, institutions, programs });

    this.sortedUsers = this.users.filter((user) => {
      const userInstitution = user.institution || '';
      const userStudyProgram = user.studyProgram || '';

      const matchesRole = roles.includes(user.role);
      const matchesInstitution = institutions.includes(userInstitution);
      const matchesProgram = programs.includes(userStudyProgram);

      return matchesRole && matchesInstitution && matchesProgram;
    });
  }
}
