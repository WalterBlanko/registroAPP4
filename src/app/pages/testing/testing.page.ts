import { Component, OnInit } from '@angular/core';
import { ApiDuocService } from 'src/app/services/api_duoc/api-duoc.service';

@Component({
  selector: 'app-testing',
  templateUrl: './testing.page.html',
  styleUrls: ['./testing.page.scss'],
})
export class TestingPage implements OnInit {
  students: any = [];

  constructor(
    private api: ApiDuocService
  ) { }

  ngOnInit() {
    this.getStudents();
  }

  getStudents() {
    return this.api.getAsignatures().subscribe( (data: {}) => {
      this.students = data;
      console.log(this.students[0].student_mails);
    });
  }
}
