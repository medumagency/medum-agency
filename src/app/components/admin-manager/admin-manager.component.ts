import { Component, OnInit } from '@angular/core';
import { IJobOffer } from '../../interfaces/jobOffer.interface';
import { NgForm } from '@angular/forms';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin-manager',
  templateUrl: './admin-manager.component.html',
  styleUrls: ['./admin-manager.component.scss']
})
export class AdminManagerComponent implements OnInit {

  public offer: IJobOffer;

  constructor() {
  }

  ngOnInit() {
  }

  createOffer(data?: Object): IJobOffer {
    const basic = {
      title: '',
      polish: '',
      english: '',
      germany: '',
      country: '',
      region: '',
      city: '',
      date: data ? Date.now() : 0
    };
    return Object.assign(basic, data);
  }

  saveOffer(f: NgForm) {
    this.offer = this.createOffer(f.value);
    console.log(this.offer);
    f.resetForm();

  }

  setData(data) {
    this.offer = this.createOffer(data);
  }
}
