import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApplicationService } from '../../services/application.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ScholarshipService } from '../../services/scholarship.service';

@Component({
  selector: 'stipendo-application-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './application-form.component.html',
  styleUrl: './application-form.component.scss'
})
export class ApplicationFormComponent implements OnInit {
  scholarshipId!: string; // Saņem stipendijas ID no vecāka komponentes
  applicationForm: FormGroup;

  

  constructor(
    private fb: FormBuilder,
    private applicationService: ApplicationService,
    private router: Router,
    private route: ActivatedRoute,
    private scholarshipService: ScholarshipService
  ) {
    this.applicationForm = this.fb.group({
      motivationLetter: ['', [Validators.required, Validators.minLength(50)]], // Validācijas noteikumi
    });
  }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.scholarshipId = params['scholarshipId'];
      console.log('Scholarship ID from route params:', this.scholarshipId);
    });
  }
  

  // Pieteikuma iesniegšanas loģika
  submitApplication(): void {
    if (this.applicationForm.invalid) {
      alert('Lūdzu, aizpildiet visus laukus');
      return;
    }

    const formData = new FormData();
    console.log('Motivation Letter:', this.applicationForm.value.motivationLetter);
console.log('Scholarship ID:', this.scholarshipId);

    formData.append('motivationLetter', this.applicationForm.value.motivationLetter);
    formData.append('scholarshipId', this.scholarshipId);

    this.applicationService.submitApplication({
      scholarshipId: this.scholarshipId,
      motivationLetter: this.applicationForm.value.motivationLetter,
    }).subscribe({
      next: () => {
        alert('Pieteikums veiksmīgi iesniegts!');
        this.router.navigate(['/scholarship-list']); // Pārvirza lietotāju
      },
      error: (err) => {
        console.error('Pieteikuma iesniegšanas kļūda:', err);
        alert('Radās kļūda. Lūdzu, mēģiniet vēlreiz.');
      },
    });
  }
}
