import { Routes, RouterModule } from "@angular/router";
import { SignInComponent } from "./auth/sign-in/sign-in.component";
import { ModuleWithProviders } from "@angular/core";
import { StartcenterComponent } from "./startcenter/startcenter.component";
import { AuthGuard } from "../guards/auth.guard";
import { SignUpComponent } from "./auth/sign-up/sign-up.component";

export const routes: Routes = [
    //Módulo de segurança
    { path: 'sign-in', component: SignInComponent },
    { path: 'sign-up', component: SignUpComponent },
    { path: '', component: StartcenterComponent, canActivate: [AuthGuard] },

    { path: '**', redirectTo: '' }
];
export const ROUTING: ModuleWithProviders = RouterModule.forRoot(routes);
