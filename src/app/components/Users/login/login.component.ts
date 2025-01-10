import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'stipendo-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private destroy$: Subject<void> = new Subject<void>();
  loginError?: string;
  loginForm: FormGroup;
  forgotPasswordForm: FormGroup;
  resetPasswordForm: FormGroup;

  isForgotPasswordStep = false;
  isResetPasswordStep = false;
  userEmail = '';

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.resetPasswordForm = this.fb.group({
      verificationCode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  login(): void {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;

      this.authService.login(loginData).subscribe({
        next: (response) => {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userId', response._id);
          localStorage.setItem('role', response.role);
          localStorage.setItem('sessionToken', response.sessionToken);
          this.router.navigate(['/scholarship-list']);
        },
        error: () => {
          this.loginError = 'Nepareizs e-pasts vai parole. Mēģiniet vēlreiz.';
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  sendForgotPasswordRequest(): void {
    if (this.forgotPasswordForm.valid) {
      this.userEmail = this.forgotPasswordForm.value.email;

      this.authService.requestPasswordReset(this.userEmail).subscribe({
        next: () => {
          alert('Paroles atiestatīšanas kods nosūtīts uz jūsu e-pastu.');
          this.isForgotPasswordStep = false;
          this.isResetPasswordStep = true;
        },
        error: () => {
          alert('Neizdevās nosūtīt paroles atiestatīšanas kodu. Mēģiniet vēlreiz.');
        },
      });
    } else {
      this.forgotPasswordForm.markAllAsTouched();
    }
  }

  resetPassword(): void {
    if (this.resetPasswordForm.valid) {
      const { verificationCode, newPassword } = this.resetPasswordForm.value;

      this.authService.resetPassword(this.userEmail, verificationCode, newPassword).subscribe({
        next: () => {
          alert('Parole veiksmīgi atiestatīta. Piesakieties ar jauno paroli.');
          this.isResetPasswordStep = false;
        },
        error: () => {
          alert('Neizdevās atiestatīt paroli. Pārbaudiet kodu un mēģiniet vēlreiz.');
        },
      });
    } else {
      this.resetPasswordForm.markAllAsTouched();
    }
  }
}
