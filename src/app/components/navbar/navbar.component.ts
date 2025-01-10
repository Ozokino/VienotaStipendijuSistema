import { Component, Inject, Input, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

import { CommonModule, DOCUMENT } from '@angular/common';
import { NavItem, NavList } from '../../models/navbar.model';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'stipendo-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit{
  private destroy$: Subject<void> = new Subject<void>;
  loggedInUser$?: Observable<User | null> = this.authService.loggedInUser$;
  // isloggedIn$?: Observable<boolean | null> = this.authService.isloggedIn$;

  private localStorage: Storage | undefined;

  loggedUserId: string = '';

  constructor(private authService: AuthService, @Inject(DOCUMENT) private document: Document, private userService: UserService) {
    this.localStorage = this.document.defaultView?.localStorage;
  }

  ngOnInit() {
    this.loggedUserId = this.localStorage?.getItem('userId') as string;

    if (this.loggedUserId) {
      this.userService.getAUser(this.loggedUserId).pipe(takeUntil(this.destroy$)).subscribe({
        next: (response: User) => {
          this.authService.loggedInUserSubject.next(response);
          this.authService.loggedUserRoleSubject.next(response.role)
          
        }
      })
    }

  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  

  logout(): void {
    this.authService.logout();
    
  }
  
}
