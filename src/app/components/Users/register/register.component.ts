import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import educationData from '../../../../assets/educationData.json';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'stipendo-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  institutions = educationData.institutions;
  studyPrograms = educationData.studyPrograms;
  registerForm!: FormGroup;
  verificationForm!: FormGroup;
  isVerificationStep = false;
  userEmail = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      verifyPassword: ['', Validators.required],
      role: ['student', Validators.required],
      institution: [''],
      studyProgram: [''],
    });

    this.verificationForm = this.fb.group({
      verificationCode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    });
  }

  onRoleChange(event: any): void {
    if (event.target.value === 'sponsor') {
      this.registerForm.get('institution')?.setValue('');
      this.registerForm.get('studyProgram')?.setValue('');
    }
  }

  passwordsMatch(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const verifyPassword = group.get('verifyPassword')?.value;
    return password === verifyPassword ? null : { passwordsMismatch: true };
  }

  registerUser(): void {
    if (this.registerForm.invalid) {
      alert('Lūdzu aizpildiet visus nepieciešamos laukus.');
      return;
    }

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.userEmail = this.registerForm.value.email;
        this.isVerificationStep = true;
      },
      error: (err) => {
        if (err.error) {
          alert(`Reģistrācija neizdevās: ${err.error}`);
        } else {
          alert('Reģistrācija neizdevās. Mēģiniet vēlreiz.');
        }
      },
    });
  }

  verifyEmail(): void {
    if (this.verificationForm.invalid) {
      alert('Lūdzu ievadiet derīgu apstiprinājuma kodu.');
      return;
    }

    this.authService.verifyEmail(this.userEmail, this.verificationForm.value.verificationCode).subscribe({
      next: (response) => {
        alert(response.message);
        this.isVerificationStep = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        if (err.error && err.error.error) {
          alert(`Verifikācija neizdevās: ${err.error.error}`);
        } else {
          alert('Verifikācija neizdevās. Mēģiniet vēlreiz.');
        }
      },
    });
  }
}
