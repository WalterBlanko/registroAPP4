import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DatabaseService } from '../database/database.service';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(
    private db: DatabaseService
  ) { }

  login(email, password) {
    var e = '';
    var p = '';

    this.db.getMail(email).then(data => {
      e = data.student_email;
      p = data.student_password;
    });

    if( email != e || password != p ) {
      return true;
    } else {
      return false;
    }
  }
}
