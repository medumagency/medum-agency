import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FirestoreDaoService } from '../../services/dao/firestore-dao.service';
import { SwalObjService } from '../../services/swal-obj.service';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { forEach } from 'lodash';

@Component({
  selector: 'app-cooperation-form',
  templateUrl: './cooperation-form.component.html',
  styleUrls: ['./cooperation-form.component.scss']
})
export class CooperationFormComponent implements OnInit {
  @ViewChild('dialog') private dialogSwal: SwalComponent;

  constructor(private firestoreDAO: FirestoreDaoService, private swalObj: SwalObjService) {
  }

  ngOnInit() {
  }

  submitForm(f: NgForm) {
    const { value } = f;
    const data = Object.assign(value, { type: 'COOPERATION' });

    this.firestoreDAO.sendEmail(data).then((result) => {
      f.resetForm();
      const inputs = document.getElementsByTagName('input');
      forEach(inputs, (input) => {
        input.focus();
        input.blur();
      });
      this.swalObj.composeDialog('', 'Wiadomość została wysłana', 'success', this.dialogSwal);
    }).catch((err) => {
      this.swalObj.composeDialog('Przykro nam', 'Nie można wysłać wiadomości', 'error', this.dialogSwal);
      console.error(err);
    });
  }
}
