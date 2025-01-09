import { Component, OnInit } from '@angular/core';
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
import { ApplicationFormComponent } from "../../application-form/application-form.component";


@Component({
  selector: 'stipendo-scholarship-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,  RouterLink],
  templateUrl: './scholarship-details.component.html',
  styleUrl: './scholarship-details.component.scss'
})
export class ScholarshipDetailsComponent implements OnInit{

  scholarship: Scholarship | null = null;
  creatorName: string = 'Loading...';
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private scholarshipService: ScholarshipService,
    private userService : UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap
    .pipe(
      takeUntil(this.destroy$),
      switchMap(paramMap => {
        const scholarshipId = paramMap.get('id');
        if (!scholarshipId) {
          this.scholarshipNotFound();
          return of(null);
        }

        return this.scholarshipService.getScholarshipById(scholarshipId)
          .pipe(
            catchError(error => {
              console.error(error);
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
      }
    });
}

fetchCreatorName(creatorId: string): void {
  this.userService.getAUser(creatorId)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (user: User) => {
        this.creatorName = `${user.firstName} ${user.lastName}`;
      },
      error: () => {
        this.creatorName = 'Unknown Creator';
      }
    });
}

ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}

scholarshipNotFound(): void {
  alert('Scholarship not found');
  this.router.navigate(['/scholarship-list']);
}

apply(): void {
  console.log('Navigating to:', `/application-form/${this.scholarship?._id}`);

  if (this.scholarship) {
    this.router.navigate([`/application-form/${this.scholarship._id}`]);
  } else {
    console.error('Scholarship ID is missing.');
  }
}

  
}
// // Iegūst stipendijas ID no URL
//     const id = this.route.snapshot.paramMap.get('id');

//     if (id) {
//       // Ielādē stipendiju pēc ID
//       this.scholarshipService.getScholarshipById(id).subscribe({
//         next: (data) => {
//           this.scholarship = data;
//         },
//         error: (err) => {
//           console.error('Kļūda, ielādējot stipendiju:', err);
//           alert('Neizdevās ielādēt stipendijas detaļas.');
//         },
//       });
//     } else {
//       alert('Stipendijas ID nav pieejams.');
//     }