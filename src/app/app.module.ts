import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { DecriptEncript } from './security/decriptencript';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtInterceptor } from './security/jwt.interceptor';
import { ErrorInterceptor } from './security/error.interceptor';
import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/services/auth.service';
import { RouterModule } from '@angular/router';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { StartcenterComponent } from './startcenter/startcenter.component';
import { ROUTING, routes } from 'src/app/app.routing';
import { NgxMaskModule } from 'ngx-mask';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { ToastrModule } from 'ngx-toastr';
import { RecaptchaModule } from 'angular-google-recaptcha';
import { FlatpickrModule } from 'angularx-flatpickr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxPaginationModule } from 'ngx-pagination';
import { BooltransformPipe } from '../pipes/booltransform.pipe';


registerLocaleData(localePt);

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    ToolbarComponent,
    StartcenterComponent,
    SignUpComponent,
    BooltransformPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ROUTING,
    NgxMaskModule.forRoot(),
    RouterModule.forRoot(routes),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatListModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    NgbModule.forRoot(),
    CommonModule,
    BrowserAnimationsModule,
    NgxPaginationModule,
    FlatpickrModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 5000,
      progressBar: true,
      preventDuplicates: true
    }),
    RecaptchaModule.forRoot({
      siteKey: '6Le4YIgUAAAAAJFj9q0jVjfxVR0D_QNfGetw0JKF'
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: LOCALE_ID, useValue: 'pt' },
    AuthService,
    ReactiveFormsModule,
    BrowserModule,
    RouterModule,
    DecriptEncript,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
platformBrowserDynamic().bootstrapModule(AppModule);
