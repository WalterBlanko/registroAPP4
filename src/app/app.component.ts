import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { DatabaseService } from './services/database/database.service';
import { ApiDuocService } from './services/api_duoc/api-duoc.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  students: any = [];
  asignature: any = [];
  spa: any = [];

  constructor(
    private db: DatabaseService,
    private api: ApiDuocService,
    private loadingCtrl: LoadingController
    ) {}

  ngOnInit() {
    this.addElements();
  }

  // Función que obtiene los datos de api db.json y los ingresa a la BD 
  async addElements() {
    const loading = await this.loadingCtrl.create();
    await loading.present();
    try {
      this.addStudents();
      this.addAsignatures();
      this.addSPA();
      await loading.dismiss();
    } catch (error) {
      console.log(error.message);
      await loading.dismiss();
    }
  }

  addStudents() {
    this.api.getStudents().subscribe((data: {}) => {
      this.students = data;
      for (let i = 0; i < this.students.length; i++) {
        let e = this.students[i].id;
        let p = this.students[i].password;
        this.db.addStudent(e, p);
      }
    });
  }

  addAsignatures() {
    this.api.getAsignatures().subscribe((data: {}) => {
      this.asignature = data;
      for (let index = 0; index < this.asignature.length; index++) {
        let i = this.asignature[index].id;
        let n = this.asignature[index].name;
        let s = this.asignature[index].section;
        let m = this.asignature[index].modality;
        let t = this.asignature[index].teacher;
        this.db.addAsignature(i, n, s, m, t);
      }
    });
  }

  addSPA() {
    this.api.getSPA().subscribe((data: {}) => {
      this.spa = data;
      console.log(this.spa);
      for (let index = 0; index < this.spa.length; index++) {
        let ai = this.spa[index].id;
        let se = this.spa[index].student_email;
        this.db.addSPA(ai, se);
      }
    });
  }
}
