import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators , ReactiveFormsModule, FormControl} from '@angular/forms';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { response } from 'express';
import { AuthService } from '../../../services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import {  User, UserLoginModel } from '../../../models/user.model';

@Component({
  selector: 'stipendo-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {
  private destroy$: Subject<void> = new Subject<void>;
  loginError?: string;

  loginForm: FormGroup;

  constructor(private authService: AuthService , private router: Router,    private fb: FormBuilder,) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  login(): void {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value; // Iegūst veidlapas vērtības
      console.log('Logging in with:', loginData);

      this.authService.login(loginData).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userId', response._id);
          localStorage.setItem('role', response.role);
          localStorage.setItem('sessionToken', response.sessionToken);
          this.router.navigate(['/scholarship-list']); // Novirza uz citu lapu
         
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.loginError = 'Invalid email or password. Please try again.';
        },
      });
    }
    else {
      this.loginForm.markAllAsTouched();
    }
  }

  
}