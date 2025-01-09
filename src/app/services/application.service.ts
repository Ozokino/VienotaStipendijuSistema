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

  // Iesniedz jaunu pieteikumu
  submitApplication(data: { scholarshipId: string; motivationLetter: string }): Observable<any> {
     const sessionToken = localStorage.getItem('sessionToken'); // Iegūst tokenu no localStorage
     const headers = new HttpHeaders({
       Authorization: `Bearer ${sessionToken}`, // Pievieno sesijas tokenu galvenē
     });
 
     return this.http.post(this.apiUrl, data, { headers });
   }
  

  // Iegūst lietotāja pieteikumus
  getUserApplications(userId: string): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/user/${userId}`).pipe(
      tap((applications) => this.applicationsSubject.next(applications))
    );
  }

  // Iegūst stipendijas pieteikumus
  getScholarshipApplications(scholarshipId: string): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/scholarship/${scholarshipId}`).pipe(
      tap((applications) => this.applicationsSubject.next(applications))
    );
  }
  updateApplicationStatus(applicationId: string, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/applications/${applicationId}`, { status });
  }
}
