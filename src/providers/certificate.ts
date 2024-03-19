import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';


@Injectable()

export class CertificateProvider {
  public cert = new BehaviorSubject<any[] >([]);
  public cert$ = this.cert.asObservable();

  constructor(
  ) {
    this.loadCertificate();
    this.cert$.subscribe((certs)=>{
      console.log('local storage updated')
      localStorage.setItem('certs',JSON.stringify(certs));
    })
  }

  async loadCertificate() {
      this.cert.next(
        JSON.parse(localStorage.getItem('certs')||'[]')
      );
  }


  async addCert(newCert:any) {
    this.cert.next(
      [...this.cert.getValue(),newCert]
   );
  }
}
