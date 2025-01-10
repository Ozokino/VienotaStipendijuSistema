import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Application } from '../models/application.model';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  private apiUrl = 'http://localhost:8080/api/applications';
  private applicationsSubject = new BehaviorSubject<Application[]>([]);
  applications$ = this.applicationsSubject.asObservable();


  constructor(private http: HttpClient) {}

  submitApplication(data: { scholarshipId: string; motivationLetter: string }): Observable<any> {
     const sessionToken = localStorage.getItem('sessionToken'); 
     const headers = new HttpHeaders({
       Authorization: `Bearer ${sessionToken}`, 
     });
 
     return this.http.post(this.apiUrl, data, { headers });
   }
  
  getUserApplications(userId: string): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/user/${userId}`).pipe(
      tap((applications) => this.applicationsSubject.next(applications))
    );
  }

  getScholarshipApplications(scholarshipId: string): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/scholarship/${scholarshipId}`).pipe(
      tap((applications) => this.applicationsSubject.next(applications))
    );
  }
  updateApplicationStatus(applicationId: string, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${applicationId}/approve`, { status });
  }
}
