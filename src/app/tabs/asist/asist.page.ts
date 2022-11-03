import { Component, OnInit } from '@angular/core';
import { ApiDuocService } from 'src/app/services/api_duoc/api-duoc.service';

@Component({
  selector: 'app-asist',
  templateUrl: './asist.page.html',
  styleUrls: ['./asist.page.scss'],
})
export class AsistPage implements OnInit {
  asignatureList: any = [];

  constructor(
    public apiservice: ApiDuocService
  ) { }

  ngOnInit() {
    this.loadAsignatures();
  }

  loadAsignatures() {
    return this.apiservice.getAsignatures().subscribe( (data: {}) => {
      this.asignatureList = data;
    })
  }

}
