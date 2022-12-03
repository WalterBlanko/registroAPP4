import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';

@Component({
  selector: 'app-testing',
  templateUrl: './testing.page.html',
  styleUrls: ['./testing.page.scss'],
})
export class TestingPage implements OnInit {
  pi: number = 3.141592653589793;

  constructor(
    private geolocation: Geolocation
  ) { }

  ngOnInit() {
  }

  getPosition() {
    this.geolocation.getCurrentPosition().then((res) => {
      this.lat1 = res.coords.latitude;
      this.lat2 = res.coords.longitude;
    }).catch((err) => {
      console.log(err);
    });
  }

  watchPosition() {
    let watch = this.geolocation.watchPosition();

    watch.subscribe((data) => {
      console.log(data);
    });
  }


  lat1: number = -33.438233;
  long1: number = -70.629042;
  lat2: number = -33.433012;
  long2: number = -70.614847;


  getDist() {
    this.calculator();
  }

  calculator() {
    var degtorad = 0.01745329;
    var radtodeg = 57.29577951;
    var lat1 = this.lat1;
    var lat2 = this.lat2;
    var long1 = this.long1;
    var long2 = this.long2;

    var dlong = (long1 - long2);

    var dvalue = (Math.sin(lat1 * degtorad) * Math.sin(lat2 * degtorad)) + (Math.cos(lat1 * degtorad) * Math.cos(lat2 * degtorad) * Math.cos(dlong * degtorad));
    var dd = Math.acos(dvalue) * radtodeg;
    var miles = (dd * 69.16);
    miles = (miles * 100)/100;
    var km = (dd * 111.302);
    km = Math.round(km * 100)/100;

    console.log('Kilometros: ', km);
   }
}
