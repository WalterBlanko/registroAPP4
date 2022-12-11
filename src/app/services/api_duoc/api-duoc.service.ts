import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Student } from 'src/app/models/student';
import { Asignature } from 'src/app/models/asignature';
import { SpA } from 'src/app/models/spa';

@Injectable({
  providedIn: 'root'
})
export class ApiDuocService {
  // URL 
  baseurl = 'https://duocregistroappapi.herokuapp.com';

  constructor(
    private http: HttpClient
  ) { }

  // HTTP Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  // POST 
  createStudent(data): Observable<Student> {
    return this.http
      .post<Student>(
        this.baseurl + '/students/',
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  // Get - alumno por ID
  getStudent(id): Observable<Student> {
    return this.http.get<Student>( this.baseurl + '/students/' + id ).pipe (retry(1), catchError(this.errorHandl) );
  }

  // GET - todos los alumnos
  getStudents(): Observable<Student> {
    return this.http.get<Student>( this.baseurl + '/students/' ).pipe( retry(1), catchError(this.errorHandl) );
  }

  // GET - todos los ramos
  getAsignatures(): Observable<Asignature> {
    return this.http.get<Asignature>(this.baseurl + '/asignatures/').pipe( retry(1), catchError(this.errorHandl) );
  }

  getSPA(): Observable<SpA> {
    return this.http.get<SpA>(this.baseurl + '/spa/').pipe( retry(1), catchError(this.errorHandl) ); 
  }

  // PUT
  updateStudent(id, data): Observable<Student> {
    return this.http.put<Student>( this.baseurl + '/students/' + id, JSON.stringify(data), this.httpOptions ).pipe( retry(1), catchError(this.errorHandl));
  }
  
  // Error handling
  errorHandl(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    // console.log(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}