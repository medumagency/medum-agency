import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { forEach } from 'lodash';
import { FirestoreDaoService } from '../../services/dao/firestore-dao.service';
import { SwalObjService } from '../../services/swal-obj.service';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { CompanyEmailService } from '../../services/company-email.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  @ViewChild('dialog') private dialogSwal: SwalComponent;

  public map: any = { lat: 50.011750, lng: 20.987523 };
  public contactForm: FormGroup;
  public firstName: FormControl;
  public lastName: FormControl;
  public subject: FormControl;
  public message: FormControl;
  public email: FormControl;

  public isSending = false;

  constructor(private firestoreDAO: FirestoreDaoService,
              private swalObj: SwalObjService,
              private companyEmail: CompanyEmailService) {
  }

  ngOnInit() {
    this.createForm();
  }

  createControls() {
    this.firstName = new FormControl('', [Validators.required, Validators.minLength(3)]);
    this.lastName = new FormControl('');
    this.subject = new FormControl('', [Validators.required, Validators.minLength(5)]);
    this.message = new FormControl('', [Validators.required, Validators.minLength(5)]);
    this.email = new FormControl('', [Validators.required, Validators.email]);
  }

  createForm() {
    this.createControls();

    this.contactForm = new FormGroup({
      firstName: this.firstName,
      lastName: this.lastName,
      subject: this.subject,
      message: this.message,
      email: this.email
    });
  }

  errorMsg(property) {
    const required = property.errors.minlength.requiredLength;
    const actual = property.errors.minlength.actualLength;
    return `Password must be ${required} characters long, we need another
     ${required - actual} characters `;
  }

  submitForm(f: NgForm) {
    const { value, valid } = this.contactForm;

    if (valid) {
      this.isSending = true;
      const data = Object.assign(value, { type: 'CONTACT' });

      this.companyEmail.sendEmail(data)
        .then(() => {
          this.isSending = false;
          f.resetForm();
          this.swalObj.composeDialog('', 'Wiadomość została wysłana', 'success', this.dialogSwal);
        })
        .catch((err) => {
          this.isSending = false;
          const message = 'Nie można wysłać wiadomości. Proszę sprawdzić poprawność plików i danych.';

          this.swalObj.composeDialog('Przykro nam', message, 'error', this.dialogSwal);
          console.error(err);
        });
    }
  }
}
