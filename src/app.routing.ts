import { Routes, RouterModule } from "@angular/router";
import { SignInComponent } from "./app/auth/sign-in/sign-in.component";
import { ModuleWithProviders } from "@angular/core";
import { StartcenterComponent } from "./app/startcenter/startcenter.component";
import { AuthGuard } from "./guards/auth.guard";

export const routes: Routes = [
    //Módulo de segurança
    { path: 'sign-in', component: SignInComponent },
    { path: '', component: StartcenterComponent, canActivate: [AuthGuard] },

    { path: '**', redirectTo: '' }
];
export const ROUTING: ModuleWithProviders = RouterModule.forRoot(routes);
