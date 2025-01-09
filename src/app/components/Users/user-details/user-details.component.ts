import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../models/user.model';
import { catchError, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'stipendo-user-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent implements OnInit{
  private destroy$: Subject<void> = new Subject<void>();
  userDetails: User | null = null;

  user$ = this.userService.user$;

  

  constructor(private route: ActivatedRoute, private userService: UserService) { }

  ngOnInit() {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).pipe(
      switchMap((params) => {
        const userId = params.get('id');

        return this.userService.getAUser(userId as string);
      })
    )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


 
}
