import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  name;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.name = this.authService.getUserName();
    } else {
      this.name = undefined;
    }
  }
}
