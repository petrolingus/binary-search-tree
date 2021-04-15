import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {ToolbarComponent} from './toolbar/toolbar.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

import {ContentComponent} from './content/content.component';

@NgModule({
    declarations: [
        AppComponent,
        ToolbarComponent,
        ContentComponent,
    ],
    imports: [
        BrowserModule,
        FontAwesomeModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
