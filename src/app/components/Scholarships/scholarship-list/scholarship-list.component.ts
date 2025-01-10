import { Component, OnInit } from '@angular/core';
import { Scholarship } from '../../../models/scholarship.model';
import { ScholarshipService } from '../../../services/scholarship.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import educationData from '../../../../assets/educationData.json';

@Component({
  selector: 'stipendo-scholarship-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './scholarship-list.component.html',
  styleUrl: './scholarship-list.component.scss'
})
export class ScholarshipListComponent implements OnInit{
  scholarships: Scholarship[] = [];
  filteredScholarships: Scholarship[] = [];
  programs: string[] = educationData.studyPrograms;
  sortCriteria: 'studyProgram' | 'deadline' | null = null;
  selectedProgram: string | null = null;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private scholarshipService: ScholarshipService, private router: Router) {}

  ngOnInit(): void {
    this.getScholarships();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getScholarships() {
    this.scholarshipService.getApprovedScholarships().subscribe({
      next: (data) => {
        this.scholarships = data;
        this.filteredScholarships = [...data];
      },
      error: (err) => {
        console.error('Kļūda, ielādējot stipendijas:', err);
        alert('Neizdevās ielādēt stipendijas. Mēģiniet vēlreiz.');
      },
    });
  }

  onProgramChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value || null;
    this.selectedProgram = value;
    this.filterAndSort();
  }

  onSortChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value as 'studyProgram' | 'deadline' | null;
    this.sortCriteria = value || null;
    this.filterAndSort();
  }

  filterAndSort(): void {
    this.filteredScholarships = this.scholarships.filter((s) =>
      this.selectedProgram ? s.studyProgram === this.selectedProgram : true
    );

    if (this.sortCriteria === 'studyProgram') {
      this.filteredScholarships.sort((a, b) => a.studyProgram.localeCompare(b.studyProgram));
    } else if (this.sortCriteria === 'deadline') {
      this.filteredScholarships.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    }
  }
}
