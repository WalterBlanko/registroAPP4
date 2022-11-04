import { Component, OnInit } from '@angular/core';
import { ApiDuocService } from 'src/app/services/api_duoc/api-duoc.service';
import { DatabaseService } from 'src/app/services/database/database.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-testing',
  templateUrl: './testing.page.html',
  styleUrls: ['./testing.page.scss'],
})
export class TestingPage implements OnInit {
  students: any = [];

  constructor(
    private api: ApiDuocService,
    private db: DatabaseService,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.addStudents();
  }

  async addStudents() {
    const loading = await this.loadingCtrl.create();
    await loading.present();
    this.api.getStudents().subscribe( async (data: {}) => {
      this.students = data;
      for (let i = 0; i < this.students.length; i++) {
        let e = this.students[i].id;
        let p = this.students[i].password;
        this.db.addStudent(e, p);
        await loading.dismiss();
      }
    });
  }

  // getStudents() {
  //   this.db.getStudents().then(data => {
  //     this.students = data;
  //     this.students.forEach(e => {
  //       console.log(e.student_email);
  //     })
  //   })
  // }
}
