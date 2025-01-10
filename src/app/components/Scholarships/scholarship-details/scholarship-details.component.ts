import { Component, OnDestroy, OnInit } from '@angular/core';
import { Scholarship } from '../../../models/scholarship.model';
import { catchError, of, Subject, switchMap, takeUntil } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ScholarshipService } from '../../../services/scholarship.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import { response } from 'express';
import { error } from 'node:console';
import { CommonModule } from '@angular/common';
import { ApplicationFormComponent } from "../../Applications/application-form/application-form.component";


@Component({
  selector: 'stipendo-scholarship-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,  RouterLink],
  templateUrl: './scholarship-details.component.html',
  styleUrl: './scholarship-details.component.scss'
})
export class ScholarshipDetailsComponent implements OnInit, OnDestroy {
  scholarship: Scholarship | null = null;
  creatorName: string = 'Ielādē...';
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private scholarshipService: ScholarshipService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        takeUntil(this.destroy$),
        switchMap((paramMap) => {
          const scholarshipId = paramMap.get('id');
          if (!scholarshipId) {
            this.scholarshipNotFound();
            return of(null);
          }

          return this.scholarshipService.getScholarshipById(scholarshipId).pipe(
            catchError((error) => {
              console.error('Kļūda, ielādējot stipendiju:', error);
              this.scholarshipNotFound();
              return of(null);
            })
          );
        })
      )
      .subscribe({
        next: (scholarship: Scholarship | null) => {
          if (scholarship) {
            this.scholarship = scholarship;
            this.fetchCreatorName(scholarship.creator);
          }
        },
      });
  }

  fetchCreatorName(creatorId: string): void {
    this.userService
      .getAUser(creatorId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user: User) => {
          this.creatorName = `${user.firstName} ${user.lastName}`;
        },
        error: () => {
          this.creatorName = 'Nezināms izveidotājs';
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  scholarshipNotFound(): void {
    alert('Stipendija netika atrasta');
    this.router.navigate(['/scholarship-list']);
  }

  apply(): void {
    if (this.scholarship) {
      console.log('Navigācija uz:', `/application-form/${this.scholarship._id}`);
      this.router.navigate([`/application-form/${this.scholarship._id}`]);
    } else {
      console.error('Stipendijas ID nav pieejams.');
    }
  }
}
