import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { ModuleWithProviders } from '@angular/core';
import { StartcenterComponent } from './startcenter/startcenter.component';
import { AuthGuard } from '../guards/auth.guard';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { UnitComponent } from './unit/unit.component';
import { DepartmentComponent } from './department/department.component';
import { ResiduesRegister } from 'src/models/residuesregister';
import { ResiduesRegisterComponent } from './residues-register/residues-register.component';
import { SchedulingComponent } from './scheduling/scheduling.component';
import { EntriesManagementComponent } from './entries-management/entries-management.component';

export const routes: Routes = [
	{ path: '', component: StartcenterComponent, canActivate: [ AuthGuard ] },
	{ path: 'sign-in', component: SignInComponent },
	{ path: 'sign-up', component: SignUpComponent },
	{ path: 'logout', component: LogoutComponent },

	{ path: 'account', component: SignUpComponent, canActivate: [ AuthGuard ] },
	{ path: 'unit', component: UnitComponent, canActivate: [ AuthGuard ] },
	{ path: 'department', component: DepartmentComponent, canActivate: [ AuthGuard ] },
	{ path: 'residue-register', component: ResiduesRegisterComponent, canActivate: [ AuthGuard ] },
	{ path: 'scheduling', component: SchedulingComponent, canActivate: [ AuthGuard ] },
	{ path: 'entries-management', component: EntriesManagementComponent, canActivate: [ AuthGuard ] },

	{ path: '**', redirectTo: '' }
];
export const ROUTING: ModuleWithProviders = RouterModule.forRoot(routes);
