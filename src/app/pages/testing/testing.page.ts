import { Component, OnInit } from '@angular/core';
import { ApiDuocService } from 'src/app/services/api_duoc/api-duoc.service';
import { DatabaseService } from 'src/app/services/database/database.service';
import { LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { SpA } from 'src/app/models/spa';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-testing',
  templateUrl: './testing.page.html',
  styleUrls: ['./testing.page.scss'],
})
export class TestingPage implements OnInit {
  students: any = [];
  asignature: any = [];
  spa: any = [];
  test: any = [];

  asig_id: any = [];
  asig_name: any = [];

  id: string;
  email: string;

  constructor(
    private api: ApiDuocService,
    private db: DatabaseService,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    // this.addElements();
    this.changeFormat(this.today);
  }

  async addElements() {
    const loading = await this.loadingCtrl.create();
    await loading.present();
    try {
      this.addStudents();
      this.addAsignatures();
      this.addSPA();
      // this.getSpa();
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

  mostrarRamos() {
    this.db.getSpA('correo@duocuc.cl')
      .then(data => {
        this.asignature = data;
        this.asignature.forEach(element => {
          this.asig_id = element.asignature_id;
          this.asig_name = element.asignature_name;
        })
      })
  }

  getSpa() {
    let student_email = 'correo@duocuc.cl';

    this.db.getSpA(student_email).then(data => {
      this.test = data;
      for (let i = 0; i < this.test.length; i++) {
        this.asig_id = this.test[i].asignature_id;
        this.asig_name = this.test[i].asignature_name;

        console.log(this.asig_id, this.asig_name);
      }
    });
  }

  // Date
  name = 'Angular ';
  today = new Date();
  changedDate = '';
  pipe = new DatePipe('en-US');
  changeFormat(today){
    let ChangedFormat = this.pipe.transform(this.today, 'dd-MM-YYYY');
    this.changedDate = ChangedFormat;
    console.log(this.changedDate);
  }

}
