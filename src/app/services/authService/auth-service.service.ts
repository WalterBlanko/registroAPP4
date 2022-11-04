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

  login(email: any, password: any, e: any, p: any ) {
    if(email != e || password != p) {
      return false;
    } else {
      return true;
    }
  }

  forget(email, password) {
    try {
      this.db.updateUser(email, password);
      return true;
    } catch {
      return false;
    }
  }

}
