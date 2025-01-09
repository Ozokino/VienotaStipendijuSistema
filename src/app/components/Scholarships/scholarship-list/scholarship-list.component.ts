import { Component, OnInit } from '@angular/core';
import { Scholarship } from '../../../models/scholarship.model';
import { ScholarshipService } from '../../../services/scholarship.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';

@Component({
  selector: 'stipendo-scholarship-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './scholarship-list.component.html',
  styleUrl: './scholarship-list.component.scss'
})
export class ScholarshipListComponent implements OnInit{
  scholarships: Scholarship[] = [];
  private destroy$: Subject<void> = new Subject<void>;

  constructor(private scholarshipService: ScholarshipService, private router: Router) {}

  ngOnInit(): void {
    this.getScholarships();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  getScholarships(){
    this.scholarshipService.getApprovedScholarships().subscribe({
      next: (data) => {
        this.scholarships = data;
      },
      error: (err) => {
        console.error('Kļūda, ielādējot stipendijas:', err);
        alert('Neizdevās ielādēt stipendijas. Mēģiniet vēlreiz.');
      },
    });
  }
}
