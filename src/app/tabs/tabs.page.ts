import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from '../services/database/database.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  email: string;
  password: string;

  asignature: any = [];
  asig_id: string;
  asig_name: string;

  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private db: DatabaseService
  ) { }

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    var data = {
      "email": "",
      "password": ""
    }

    this.activateRoute.queryParamMap.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        data = this.router.getCurrentNavigation().extras.state.data;
        this.email = data.email;
        this.password = data.password;

        this.db.getSpA(data.email)
          .then(data => {
            this.asignature = data;
            this.asignature.forEach(element => {
              this.asig_id = element.asignature_id;
              this.asig_name = element.asignature_name;
            });
          });
      }
    });
  }
}
