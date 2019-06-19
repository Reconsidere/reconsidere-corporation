import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { environment } from 'src/environments/environment';
import * as messageCode from 'message.code.json';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  hidepassword = true;

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthService, private toastr: ToastrService) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.authenticationService.logout();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() {
    return this.loginForm.controls;
  }

  async onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    if (!environment.auth) {
      this.router.navigate([this.returnUrl]);
    } else {

      try {
        let isLogged = await this.authenticationService.signIn(this.f.username.value, this.f.password.value);
        if (isLogged) {
          this.loading = false;
          this.router.navigate([this.returnUrl]);
        } else {
          this.loading = false;
        }
      } catch (error) {
        this.loading = false;
        this.toastr.error(messageCode['ERROR'][error.message]['summary']);
        return;
      }
    }
  }
}
