import { NgModule } from '@angular/core';
import { MatCheckboxModule, MatTabsModule, MatExpansionModule, MatInputModule} from '@angular/material';

@NgModule({
  imports: [MatCheckboxModule, MatTabsModule, MatExpansionModule, MatInputModule],
  exports: [MatCheckboxModule, MatTabsModule, MatExpansionModule, MatInputModule],
})
export class MaterialModule {
}
