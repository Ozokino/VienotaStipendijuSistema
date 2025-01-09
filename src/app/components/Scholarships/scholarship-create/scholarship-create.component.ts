import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ScholarshipService } from '../../../services/scholarship.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import educationData from '../../../../assets/educationData.json';

@Component({
  selector: 'stipendo-scholarship-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './scholarship-create.component.html',
  styleUrl: './scholarship-create.component.scss'
})
export class ScholarshipCreateComponent {
  scholarshipForm: FormGroup;
  studyPrograms = educationData.studyPrograms;

  constructor(
    private fb: FormBuilder,
    private scholarshipService: ScholarshipService,
    private router: Router
  ) {
    // Inicializējam Reactive Form ar validācijām
    this.scholarshipForm = this.fb.group({
      title: ['', Validators.required],
      studyProgram: ['', Validators.required],
      description: ['', Validators.required],
      type: ['one-time', Validators.required], // Noklusējuma tips
      amount: ['', [Validators.required]], // Der tikai formāts, piemēram, 500€
      requirements: ['', Validators.required],
      deadline: ['', Validators.required],
    });
  }

  // Stipendijas izveide
  createScholarship(): void {
    if (this.scholarshipForm.invalid) {
      // Ja forma nav derīga, parāda paziņojumu
      alert('Lūdzu, aizpildiet visus laukus pareizi!');
      return;
    }

    // Izsauc ScholarshipService, lai nosūtītu pieprasījumu uz serveri
    this.scholarshipService.createScholarship(this.scholarshipForm.value).subscribe({
      next: () => {
        alert('Stipendija veiksmīgi izveidota!');
        this.router.navigate(['/scholarship-list']); // Pārvieto uz sarakstu pēc veiksmes
      },
      error: (err) => {
        console.error('Kļūda, izveidojot stipendiju:', err);
        alert('Kļūda, izveidojot stipendiju.');
      },
    });
  }
}
