import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { FirestoreDaoService } from '../../services/dao/firestore-dao.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';


@Component({
  selector: 'app-job-form',
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.scss']
})
export class JobFormComponent implements OnInit {

  fileToUpload: Array<any> = [];

  constructor(private route: ActivatedRoute, private firestoreDAO: FirestoreDaoService) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log(params);
    });
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = [];
    this.base64Encode(files).subscribe((item) => {
      this.fileToUpload.push(item);
    });
  }

  base64Encode(files: FileList) {
    const observables = [];

    function encodeFile(file: File) {
      return new Observable((observer) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          observer.next({
            filename: file.name,
            filetype: file.type,
            fileSize: file.size,
            path: reader.result
          });
        };
      });
    }

    Array.from(files).forEach((file) => {
      observables.push(encodeFile(file));
    });

    return Observable.merge(observables).mergeMap(flat => flat);
  }

  submitForm(f: NgForm) {
    const { value } = f;
    const data = Object.assign(value, { type: 'JOB', attachments: this.fileToUpload });

    console.log(this.fileToUpload);

    this.firestoreDAO.sendEmail(data).then((result) => {
      console.log(result);
    }).catch((err) => {
      console.error(err);
    });
  }
}
