import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-job-form',
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.scss']
})
export class JobFormComponent implements OnInit {

  fileToUpload: File = null;

  constructor() {
  }

  ngOnInit() {
  }

  handleFileInput(files: File) {
    this.fileToUpload = files;
    console.log(this.fileToUpload);
  }
}
