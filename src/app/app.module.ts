import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { DecriptEncript } from './security/decriptencript';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtInterceptor } from './security/jwt.interceptor';
import { ErrorInterceptor } from './security/error.interceptor';
import { APP_BASE_HREF, CommonModule, DatePipe } from '@angular/common';
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
import { ToastrModule } from 'ngx-toastr';
import { RecaptchaModule } from 'angular-google-recaptcha';
import { FlatpickrModule } from 'angularx-flatpickr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxPaginationModule } from 'ngx-pagination';
import { BooltransformPipe } from '../pipes/booltransform.pipe';
import { LogoutComponent } from './auth/logout/logout.component';
import { UnitComponent } from './unit/unit.component';
import { DepartmentComponent } from './department/department.component';
import { CheckpointComponent } from './checkpoint/checkpoint.component';
import { ResiduesRegisterComponent } from './residues-register/residues-register.component';
import { SchedulingComponent } from './scheduling/scheduling.component';
import { CalendarModule } from 'primeng/calendar';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { EntriesManagementComponent } from './entries-management/entries-management.component';
import { ProviderRegistrationComponent } from './provider-registration/provider-registration.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { ChartModule } from 'primeng/chart';
import { ResidueRegisterGraphicComponent } from './graphics/residue-register-graphic/residue-register-graphic.component';
import 'chartjs-plugin-labels';
import { SearchGraphicResidueRegisterPipe } from '../pipes/residue-register-graphic/search-graphic-residue-register.pipe';
import { EntriesManagementGraphicComponent } from './graphics/entries-management-graphic/entries-management-graphic.component';
import { SearchGraphicEntriePipe } from '../pipes/search-graphic-entrie/search-graphic-entrie.pipe';
import { GridsterModule } from 'angular-gridster2';
import { WidgetUnitComponent } from './widget/widget-unit/widget-unit.component';
import { LayoutItemDirective } from './directives/layout-item.directive';
import { WidgetEntriesManagementGraphicComponent } from './widget/widget-entries-management-graphic/widget-entries-management-graphic.component';
import { WidgetResidueRegisterGraphicComponent } from './widget/widget-residue-register-graphic/widget-residue-register-graphic.component';
registerLocaleData(localePt);

@NgModule({
	entryComponents: [
		WidgetUnitComponent,
		WidgetEntriesManagementGraphicComponent,
		WidgetResidueRegisterGraphicComponent
	],
	declarations: [
		AppComponent,
		SignInComponent,
		ToolbarComponent,
		StartcenterComponent,
		SignUpComponent,
		BooltransformPipe,
		LogoutComponent,
		UnitComponent,
		DepartmentComponent,
		CheckpointComponent,
		ResiduesRegisterComponent,
		SchedulingComponent,
		EntriesManagementComponent,
		ProviderRegistrationComponent,
		ResidueRegisterGraphicComponent,
		SearchGraphicResidueRegisterPipe,
		EntriesManagementGraphicComponent,
		SearchGraphicEntriePipe,
		LayoutItemDirective,
		WidgetUnitComponent,
		WidgetEntriesManagementGraphicComponent,
		WidgetResidueRegisterGraphicComponent
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
			preventDuplicates: true,
			positionClass: 'toast-top-right'
		}),
		RecaptchaModule.forRoot({
			siteKey: '6Le4YIgUAAAAAJFj9q0jVjfxVR0D_QNfGetw0JKF'
		}),
		CalendarModule,
		DragDropModule,
		ChartModule,
		GridsterModule
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
		DatePipe
	],
	bootstrap: [ AppComponent ]
})
export class AppModule {}
platformBrowserDynamic().bootstrapModule(AppModule);
