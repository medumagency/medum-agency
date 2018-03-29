import { NgModule } from '@angular/core';
import { MatCheckboxModule, MatTabsModule, MatExpansionModule, MatInputModule, MatSelectModule} from '@angular/material';

@NgModule({
  imports: [MatCheckboxModule, MatTabsModule, MatExpansionModule, MatInputModule, MatSelectModule],
  exports: [MatCheckboxModule, MatTabsModule, MatExpansionModule, MatInputModule, MatSelectModule],
})
export class MaterialModule {
}
