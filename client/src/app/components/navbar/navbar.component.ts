import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PreviousRouteService } from 'src/app/services/previous-route.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  previousUrl!: string

  constructor(
    private router: Router,
    private previousRouteService: PreviousRouteService,
  ) { }

  ngOnInit(): void {
    this.previousUrl = this.previousRouteService.getPreviousUrl()!.toString()
  }

  logout() {
    localStorage.removeItem('token')
    this.router.navigateByUrl(this.previousUrl)
  }
}
