import { Component, OnInit } from '@angular/core';

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

}
