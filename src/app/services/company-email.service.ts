import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { IEmail } from '../interfaces/email.interface';


// 'Access-Control-Allow-Origin': '*'
const emailUrl = environment.sendEmail;

@Injectable()
export class CompanyEmailService {

  constructor(private httpClient: HttpClient) {
  }

  convertEmailData(data: IEmail): any {
    const fullName = `${data.firstName} ${data.lastName || ''}`;
    let html: string;

    if (data.type === 'JOB') {
      data.subject = 'FORMULARZ ZGŁOSZENIA';
      html = `<h3>Od: ${fullName}</h3>
            <div>Email: ${data.email}</div>
            <div>Adres: ${data.address}</div>
            <dvi>Telefon: ${data.phone}</dvi>
            <div>Stanowisko: ${data.position}</div>
            <div>${data.message}</div>`;
    } else if (data.type === 'COOPERATION') {
      data.subject = 'FORMULARZ WSPÓŁPRACY';
      html = `<h3>Firma: ${data.companyName}</h3>
            <div>Email: ${data.email}</div>
            <div>Adres: ${data.address}</div>
            <dvi>Telefon: ${data.phone}</dvi>`;
    } else if (data.type === 'CONTACT') {
      const subject = data.subject;
      data.subject = 'KONTAKT';
      html = `<h3>Od: ${fullName}</h3>
            <div>Email: ${data.email}</div>
            <div>Temat: ${subject}</div>
            <dvi>${data.message}</dvi>`;
    }

    const result = {
      type: data.type,
      subject: data.subject,
      html,
      attachments: data.attachments || []
    };

    return result;
  }


  sendEmail(data) {
    const params = this.convertEmailData(data);
    const headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(emailUrl, params).toPromise();
  }
}
