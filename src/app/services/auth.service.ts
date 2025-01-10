import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable} from 'rxjs';
import { User, TempUser, AuthenticatedUser, UserLoginModel } from '../models/user.model';
import {map, tap} from 'rxjs/operators'
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  
  userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  usersSubject = new BehaviorSubject<User[] | null>(null);
  users$ = this.usersSubject.asObservable();

  loggedInUserSubject = new BehaviorSubject<User | null>(null);
  loggedInUser$ = this.loggedInUserSubject.asObservable();


  loggedUserRoleSubject = new BehaviorSubject<string | null>(null);
  loggedUserRole$: Observable<string | null> = this.loggedUserRoleSubject.asObservable();

  private localStorage: Storage | undefined;  




  constructor(private http: HttpClient, private router :Router, @Inject(DOCUMENT) private document: Document) 
  { this.localStorage = this.document.defaultView?.localStorage;}
  
  register(user: TempUser): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user);
  }

  verifyEmail(email: string, verificationCode: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-email`, { email, verificationCode });
  }

  sendVerificationCode(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-verification-code`, { email });
  }

  login(loginData: AuthenticatedUser): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, loginData).pipe(
      tap(value => {
        this.loggedInUserSubject.next(value);
        
      })
    );
  }
  requestPasswordReset(email: string): Observable<any> {
    const url = `${this.apiUrl}/request-password-reset`;
    return this.http.post(url, { email });
  }
  resetPassword(email: string, verificationCode: string, newPassword: string): Observable<any> {
    const url = `${this.apiUrl}/reset-password`;
    return this.http.post(url, { email, verificationCode, newPassword });
  }
  changePassword(userId: string, currentPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/update-password/${userId}`, {
      currentPassword,
      newPassword,
    });
  }
  
  
  getLoggedUserById(_id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${_id}`);
  }
 
  logout(): void {
    localStorage.clear();
    this.loggedInUserSubject.next(null);
    this.router.navigate(['/login']);
  }
  
}
