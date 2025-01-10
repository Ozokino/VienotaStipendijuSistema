import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Scholarship } from '../models/scholarship.model';

@Injectable({
  providedIn: 'root'
})
export class ScholarshipService {

  private apiUrl = 'http://localhost:8080/api/scholarships';
  private scholarshipsSubject = new BehaviorSubject<Scholarship[] | null>(null);
  scholarships$ = this.scholarshipsSubject.asObservable();

  private scholarship = new BehaviorSubject<Scholarship | null>(null);
  scholarship$ = this.scholarship.asObservable();
  
  private scholarshipIdSource = new BehaviorSubject<string | null>(null);
  scholarshipId$ = this.scholarshipIdSource.asObservable();
constructor(private http: HttpClient) { }
  setScholarshipId(id: string): void {
    this.scholarshipIdSource.next(id);
  }

  getAllScholarships(): Observable<Scholarship[]> {
    return this.http.get<Scholarship[]>(this.apiUrl).pipe(
      tap((scholarships) => this.scholarshipsSubject.next(scholarships))
    );
  }
   getUserScholarships(userId: string): Observable<Scholarship[]> {
      return this.http.get<Scholarship[]>(`${this.apiUrl}/user/${userId}`).pipe(
        tap((scholarships) => this.scholarshipsSubject.next(scholarships))
      );
    }

  getScholarshipById(id: string): Observable<Scholarship> {
      return this.http.get<Scholarship>(`${this.apiUrl}/${id}`).pipe(
        tap(value => {
          this.scholarship.next(value);
        })
      );
    }

  createScholarship(scholarshipData: any): Observable<any> {
    const sessionToken = localStorage.getItem('sessionToken'); 
    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionToken}`, 
    });

    return this.http.post(this.apiUrl, scholarshipData, { headers });
  }

  deleteScholarship(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  updateScholarship(id: string, updates: Partial<Scholarship>): Observable<Scholarship> {
    return this.http.patch<Scholarship>(`${this.apiUrl}/${id}`, updates);
  }

  getApprovedScholarships(): Observable<Scholarship[]> {
    return this.http.get<Scholarship[]>(`${this.apiUrl}/approved`);
  }

  getPendingScholarships(): Observable<Scholarship[]> {
    return this.http.get<Scholarship[]>(`${this.apiUrl}/pending`);
  }

 
  approveAScholarship(id: string, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/approve`, { status });
  }
  getMyScholarships(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mine`);
  }
}

