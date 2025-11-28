import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-components',
  imports: [],
  templateUrl: './home-components.html',
  styleUrl: './home-components.css',
})
export class HomeComponents {
  constructor(private router: Router) {}

  onStartAdventure(): void {
    this.router.navigate(['/personajes']);
  }
}
