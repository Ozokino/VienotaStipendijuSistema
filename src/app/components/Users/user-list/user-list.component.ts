import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user.model';
import { Subject, takeUntil } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'stipendo-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {

  

  private destroy$: Subject<void> = new Subject<void>;
  users$ = this.userService.users$;

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.userService.getAllUsers().pipe(takeUntil(this.destroy$)).subscribe();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  
  viewUserDetails(userId: string): void {
    this.router.navigate(['/users', userId]);
  }
}
