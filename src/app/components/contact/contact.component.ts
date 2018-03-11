import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  public map: any = { lat: 50.011750, lng: 20.987523 };

  constructor() {
  }

  ngOnInit() {
  }

  sendEmail(f: NgForm) {
    const { value } = f;
    const data = {
        subject: value.subject,
        text: `${value.name}
      ${value.email}
      ${value.text}`
      }
    ;
    console.log(value);

    console.log(console.log(btoa('password')));
  }
}
