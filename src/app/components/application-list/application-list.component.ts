import { Component, Inject } from '@angular/core';
import { Application } from '../../models/application.model';
import { ApplicationService } from '../../services/application.service';
import { CommonModule, DOCUMENT } from '@angular/common';
import { UserService } from '../../services/user.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'stipendo-application-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './application-list.component.html',
  styleUrl: './application-list.component.scss'
})
export class ApplicationListComponent {
  applications$ = this.applicationService.applications$;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private applicationService: ApplicationService,
    private authService: AuthService
  ) {}

   ngOnInit(): void {
    const loggedInUser = this.authService.loggedInUserSubject.value;

    if (loggedInUser) {
      if (loggedInUser.role === 'student') {
        this.applicationService
          .getUserApplications(loggedInUser._id)
          .pipe(takeUntil(this.destroy$))
          .subscribe();
      } 
    }
  }
  

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

