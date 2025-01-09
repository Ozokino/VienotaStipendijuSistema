import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import educationData from '../../../../assets/educationData.json';
import { Subject, takeUntil } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '../../../models/user.model';
import { response } from 'express';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'stipendo-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
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
      studyProgram: ['']
    });

    this.verificationForm = this.fb.group({
      verificationCode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
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
      alert('Please fill in all required fields.');
      return;
    }
  
    console.log('Submitting registration form:', this.registerForm.value);
  
    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.userEmail = this.registerForm.value.email;
        this.isVerificationStep = true;
      },
      error: (err) => {
        console.error('Registration failed:', err);
        // Parādām kļūdas ziņojumu tikai, ja backend atgriež kļūdu
        if (err.error) {
          alert(`Registration failed: ${err.error}`);
        } else {
          alert('Registration failed. Please try again.');
        }
      },
    });
  }

  verifyEmail(): void {
    if (this.verificationForm.invalid) {
      alert('Please enter a valid verification code.');
      return;
    }
  
    console.log('Submitting verification code:', this.verificationForm.value);
  
    this.authService.verifyEmail(this.userEmail, this.verificationForm.value.verificationCode).subscribe({
      next: (response) => {
        console.log('Email verification successful:', response);
        alert(response.message); // Parādām veiksmīgu ziņu
        this.isVerificationStep = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Email verification failed:', err);
        // Atgriez kļūdas ziņu no backend
        if (err.error && err.error.error) {
          alert(`Verification failed: ${err.error.error}`);
        } else {
          alert('Verification failed. Please try again.');
        }
      },
    });
  }
  
}
  
  
