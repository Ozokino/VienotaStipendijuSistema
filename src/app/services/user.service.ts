import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, TempUser } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {
 


  constructor(private http: HttpClient) { }
  private apiUrl = 'http://localhost:8080/api/users';

  userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();
  usersSubject = new BehaviorSubject<User[] | null>(null);
  users$ = this.usersSubject.asObservable();
  
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      tap(value => {
        this.usersSubject.next(value);
      })
    );
  }
  getAUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(
      tap(value => {
        this.userSubject.next(value);
      })
    );
  }

  deleteAUser(id: string): Observable<User> {
    return this.http.delete<User>(`${this.apiUrl}/${id}`);
  }
  updateUser(id: string, userData: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, userData);
  }
  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/email/${email}`);
  }
  getPendingSponsors(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/pending`);
  }
  approveASponsor(id: string, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/sponsors/${id}/approve`, { status });
  }
}
