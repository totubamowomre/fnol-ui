import { Component, OnInit } from '@angular/core';
import { SessionService } from '../session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  constructor(private sessionService: SessionService, private router: Router) { }

  ngOnInit(): void { }

  async onStartButtonClick(): Promise<any> {
    try {
      const sessionKey: string = await this.sessionService.startSession();
      // Navigate to the form page with fnolData
      this.router.navigate(['/form'], { state: { sessionKey: sessionKey } });
    } catch (error) {
      throw error;
    }
  }
}