import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database/database.service';

@Component({
  selector: 'app-asist',
  templateUrl: './asist.page.html',
  styleUrls: ['./asist.page.scss'],
})
export class AsistPage implements OnInit {
  asignature: any = [];
  asig_id: any = [];
  asig_name: any = [];
  asig_teacher: any = [];
  asig_section: any = [];
  asig_modality: any = [];
  email: string;
  password: string;

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
              this.asig_teacher = element.asignature_teacher
              this.asig_section = element.asignature_section
              this.asig_modality = element.asignature_modality
            });
          });
      }
    });
  }
}
