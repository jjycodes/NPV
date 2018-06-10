import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './components/app/app.component';
import { HomeComponent } from './components/home/home.component';
import { NPVComponent } from './components/npv/npv.component';

import { ChartsModule } from 'ng2-charts';

@NgModule({
    declarations: [
        AppComponent,
        NPVComponent,
        HomeComponent
    ],
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        ChartsModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'NPVComponent', pathMatch: 'full' },
            { path: 'npv', component: NPVComponent },
            { path: '**', redirectTo: 'npv' }
        ])
    ]
})
export class AppModuleShared {
}
