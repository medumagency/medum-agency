import { Injectable, ViewChild } from '@angular/core';
import { SwalComponent } from '@toverux/ngx-sweetalert2';

@Injectable()
export class SwalObjService {

  constructor() {
  }

  composeDialog(title: string,
                text: string,
                type: string = 'success',
                swalRef: SwalComponent,
                showCancelButton: boolean = false): Promise<any> {
    const info = {
      title,
      text,
      type,
      showCancelButton
    };
    Object.assign(swalRef, info);
    return swalRef.show();
  }

}
