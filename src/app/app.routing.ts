import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { ModuleWithProviders } from '@angular/core';
import { StartcenterComponent } from './startcenter/startcenter.component';
import { AuthGuard } from '../guards/auth.guard';
import { LogoutComponent } from './auth/logout/logout.component';
import { UnitComponent } from './unit/unit.component';
import { DepartmentComponent } from './department/department.component';
import { ResiduesRegister } from 'src/models/residuesregister';
import { ResiduesRegisterComponent } from './residues-register/residues-register.component';
import { SchedulingComponent } from './scheduling/scheduling.component';
import { EntriesManagementComponent } from './entries-management/entries-management.component';
import { ProviderRegistrationComponent } from './provider-registration/provider-registration.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { ResidueRegisterGraphicComponent } from './graphics/residue-register-graphic/residue-register-graphic.component';
import { EntriesManagementGraphicComponent } from './graphics/entries-management-graphic/entries-management-graphic.component';
import { DocumentsManagementComponent } from './documents-management/documents-management.component';
import { CheckpointComponent } from './checkpoint/checkpoint.component';
import { ResiduePerformedComponent } from './residue-performed/residue-performed.component';

export const routes: Routes = [
	{ path: '', component: StartcenterComponent, canActivate: [ AuthGuard ] },
	{ path: 'start-center', component: StartcenterComponent, canActivate: [ AuthGuard ] },
	{ path: 'sign-in', component: SignInComponent },
	{ path: 'sign-up', component: SignUpComponent },
	{ path: 'logout', component: LogoutComponent },

	{ path: 'account', component: SignUpComponent, canActivate: [ AuthGuard ] },
	{ path: 'unit', component: UnitComponent, canActivate: [ AuthGuard ] },
	{ path: 'department', component: DepartmentComponent, canActivate: [ AuthGuard ] },
	{ path: 'residue-register', component: ResiduesRegisterComponent, canActivate: [ AuthGuard ] },
	{ path: 'residue-performed', component: ResiduePerformedComponent, canActivate: [ AuthGuard ] },
	{ path: 'scheduling', component: SchedulingComponent, canActivate: [ AuthGuard ] },
	{ path: 'entries-management', component: EntriesManagementComponent, canActivate: [ AuthGuard ] },
	{ path: 'documents-management', component: DocumentsManagementComponent, canActivate: [ AuthGuard ] },
	{ path: 'registration-provider', component: ProviderRegistrationComponent, canActivate: [ AuthGuard ] },
	{ path: 'residue-register-graph', component: ResidueRegisterGraphicComponent, canActivate: [ AuthGuard ] },
	{ path: 'entries-management-graphic', component: EntriesManagementGraphicComponent, canActivate: [ AuthGuard ] },
	{ path: 'check-point', component: CheckpointComponent, canActivate: [ AuthGuard ] },

	{ path: '**', redirectTo: '' }
];
export const ROUTING: ModuleWithProviders = RouterModule.forRoot(routes);
