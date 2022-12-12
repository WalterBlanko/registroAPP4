import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { LoadingController, Platform, ToastController, AlertController } from '@ionic/angular';
import jsQR from 'jsqr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.page.html',
  styleUrls: ['./qr.page.scss'],
})
export class QrPage {
  scanActive = false;
  scanResult = null;
  @ViewChild('video', { static: false }) video: ElementRef;
  @ViewChild('canvas', { static: false }) canvas: ElementRef;
  @ViewChild('fileinput', { static: false }) fileinput: ElementRef;

  videoElement: any;
  canvasElement: any;
  canvasContext: any;

  loading: HTMLIonLoadingElement;

  email: string;
  password: string;

  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private plt: Platform,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private alertCtrl: AlertController,
  ) {
    const isInStandaloneMode = () => 'standalone' in window.navigator && window.navigator['standalone'];
    if (this.plt.is('ios') && isInStandaloneMode()) {
      // console.log('I am a an iOS PWA!');
      // E.g. hide the scan functionality
    }
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
        // console.log(data)
      }
    });
  }

  ngAfterViewInit() {
    this.videoElement = this.video.nativeElement;
    this.canvasElement = this.canvas.nativeElement;
    this.canvasContext = this.canvasElement.getContext('2d');

    this.cargar();
    this.startScan();
  }

  captureImage() {
    this.fileinput.nativeElement.click();
  }

  handleFile(event: Event) {
    const target = event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    // const file2 = files.item(0);

    var img = new Image();
    img.onload = () => {
      this.canvasContext.drawImage(img, 0, 0, this.canvasElement.width, this.canvasElement.height);
      const imageData = this.canvasContext.getImageData(0, 0, this.canvasElement.width, this.canvasElement.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });

      if (code) {
        this.scanResult = code.data;
        this.showQrToast();
      }
    };
    img.src = URL.createObjectURL(file);
  }

  async startScan() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });
    this.videoElement.srcObject = stream;
    this.videoElement.setAttribute('playsinline', true);
    this.videoElement.play();

    this.loading = await this.loadingCtrl.create({});
    await this.loading.present();

    requestAnimationFrame(this.scan.bind(this));
  }

  async scan() {
    // console.log('SCAN');

    if (this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA) {
      if (this.loading) {
        await this.loading.dismiss();
        this.loading = null;
        this.scanActive = true;

        this.canvasElement.height = this.videoElement.videoHeight;
        this.canvasElement.width = this.videoElement.videoWidth;

        this.canvasContext.drawImage(
          this.videoElement,
          0,
          0,
          this.canvasElement.width,
          this.canvasElement.height
        );

        const imageData = this.canvasContext.getImageData(
          0,
          0,
          this.canvasElement.width,
          this.canvasElement.height
        );

        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert'
        });
        // console.log('code: ', code);

        if (code) {
          this.scanActive = false;
          this.scanResult = code.data;
          this.showQrToast();
        } else {
          if (this.scanActive) {
            requestAnimationFrame(this.scan.bind(this));
          }
        }
      }
    } else {
      requestAnimationFrame(this.scan.bind(this));
    }
  }

  //  Helper Functions  
  stopScan() {
    this.scanActive = false;
  }
  reset() {
    this.scanResult = null;
  }

  async showQrToast() {
    const toast = await this.toastCtrl.create({
      message: 'Open ${this.scanResult}?',
      position: 'top',
      buttons: [
        {
          text: 'Open',
          handler: () => {
            window.open(this.scanResult, '_system', 'location=yes');
          }
        }
      ]
    });
  }

}