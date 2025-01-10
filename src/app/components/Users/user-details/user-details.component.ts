import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../models/user.model';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'stipendo-user-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss',
})
export class UserDetailsComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();
  userDetails: User | null = null;
  editMode = false;
  userForm!: FormGroup;
  user$ = this.userService.user$;
  changePasswordForm!: FormGroup;
  showPasswordForm = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.paramMap
      .pipe(
        takeUntil(this.destroy$),
        switchMap((params) => {
          const userId = params.get('id');
          return this.userService.getAUser(userId as string);
        })
      )
      .subscribe((user) => {
        this.userDetails = user;
        this.initializeForms(user);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initializeForms(user: User) {
    this.userForm = this.fb.group({
      firstName: [user.firstName, Validators.required],
      lastName: [user.lastName, Validators.required],
    });

    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      this.userForm.reset({
        firstName: this.userDetails?.firstName,
        lastName: this.userDetails?.lastName,
      });
    }
  }

  saveChanges() {
    if (this.userForm.valid && this.userDetails) {
      const updatedUser = {
        firstName: this.userForm.value.firstName,
        lastName: this.userForm.value.lastName,
      };

      this.userService
        .updateUser(this.userDetails._id, updatedUser)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedUser) => {
            this.userDetails = { ...this.userDetails, ...updatedUser };
            this.toggleEditMode();
          },
          error: (err) => console.error('Kļūda, atjauninot lietotāju:', err),
        });
    }
  }

  deleteUser() {
    if (this.userDetails) {
      const confirmDelete = confirm(
        `Vai tiešām vēlaties dzēst lietotāju ${this.userDetails.firstName} ${this.userDetails.lastName}?`
      );
      if (confirmDelete) {
        this.userService
          .deleteAUser(this.userDetails._id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.router.navigate(['/users']);
            },
            error: (err) => console.error('Kļūda, dzēšot lietotāju:', err),
          });
      }
    }
  }

  togglePasswordForm() {
    this.showPasswordForm = !this.showPasswordForm;
  }

  changePassword() {
    if (this.changePasswordForm.valid && this.userDetails) {
      const { currentPassword, newPassword } = this.changePasswordForm.value;

      this.authService
        .changePassword(this.userDetails._id, currentPassword, newPassword)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            alert('Parole veiksmīgi nomainīta!');
            this.showPasswordForm = false;
            this.changePasswordForm.reset();
          },
          error: (err) => console.error('Kļūda, mainot paroli:', err),
        });
    }
  }
}
