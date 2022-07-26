import { Component, OnInit } from '@angular/core';
import { AppUserLoggedIn } from 'src/app/models/appUserLoggedIn';
import { AppUserService } from 'src/app/services/app-user.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(
    public appUserService: AppUserService
  ) { }

  ngOnInit(): void {
  }

}
