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
  getUserRole(): string | null {
    return localStorage.getItem('role');
  }
  getLoggedUserById(_id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${_id}`);
  }
   loadUserData(): any {
    const storedData = localStorage.getItem('userData');
    return storedData ? JSON.parse(storedData) : null;
  }
  setRole(role: string) {
    console.log('Setting role:', role); // Debug log
    this.loggedUserRoleSubject.next(role); // Emitē lomu
  }

  getRole(): string | null {
    return this.loggedUserRoleSubject.getValue(); // Atgriež pašreizējo lomu
  }

  clearRole() {
    console.log('Clearing role'); // Debug log
    this.loggedUserRoleSubject.next(null); // Notīra lomu
  }
  // updateUserData(data: any): void {
  //   this.userDataSubject.next(data);
  // }
  logout(): void {
    localStorage.clear();
    this.loggedInUserSubject.next(null);
    this.router.navigate(['/login']);
  }

 
  
  // setCurrentUser(user: { role: string; firstName: string; lastName: string, id: string }): void {
  //   this.currentUser = user;
  // }
  // getCurrentUser(): { role: string; firstName: string; lastName: string , id: string} | null {
  //   return this.currentUser;
  // }
  
}
