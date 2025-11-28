import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DragonballService } from '../../services/dragonball.service';
import { Character, APIResponse } from '../../models/character.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-personajes-component',
  imports: [CommonModule],
  templateUrl: './personajes-component.html',
  styleUrl: './personajes-component.css',
})
export class PersonajesComponent implements OnInit {
  characters: Character[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  nextUrl: string = '';
  previousUrl: string = '';
  isLoading: boolean = false;

  constructor(
    private dragonballService: DragonballService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCharacters();
  }

  loadCharacters(): void {
    this.isLoading = true;
    this.dragonballService.getCharacters(this.currentPage, 10).subscribe({
      next: (response: APIResponse) => {
        this.characters = response.items;
        this.currentPage = response.meta.currentPage;
        this.totalPages = response.meta.totalPages;
        this.nextUrl = response.links.next;
        this.previousUrl = response.links.previous;
        this.isLoading = false;
        this.fillMissingDetails();
      },
      error: (error) => {
        console.error('Error al cargar personajes:', error);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  nextPage(): void {
    if (this.nextUrl) {
      this.isLoading = true;
      this.dragonballService.getCharactersFromUrl(this.nextUrl).subscribe({
        next: (response: APIResponse) => {
          this.characters = response.items;
          this.currentPage = response.meta.currentPage;
          this.totalPages = response.meta.totalPages;
          this.nextUrl = response.links.next;
          this.previousUrl = response.links.previous;
          this.isLoading = false;
          this.fillMissingDetails();
        },
        error: (error) => {
          console.error('Error al cargar página siguiente:', error);
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  previousPage(): void {
    if (this.previousUrl) {
      this.isLoading = true;
      this.dragonballService.getCharactersFromUrl(this.previousUrl).subscribe({
        next: (response: APIResponse) => {
          this.characters = response.items;
          this.currentPage = response.meta.currentPage;
          this.totalPages = response.meta.totalPages;
          this.nextUrl = response.links.next;
          this.previousUrl = response.links.previous;
          this.isLoading = false;
          this.fillMissingDetails();
        },
        error: (error) => {
          console.error('Error al cargar página anterior:', error);
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  viewDetails(characterId: number): void {
    this.router.navigate(['/personajes', characterId]);
  }

  // Completa campos que no llegan en el listado (planeta y transformaciones) usando el endpoint de detalle
  private fillMissingDetails(): void {
    const toComplete = this.characters.filter(c =>
      (!c.originPlanet || !c.originPlanet.name) || !c.transformations || c.transformations.length === 0
    );
    if (!toComplete.length) {
      this.cdr.detectChanges();
      return;
    }
    forkJoin(toComplete.map(c => this.dragonballService.getCharacterById(c.id))).subscribe({
      next: details => {
        details.forEach(d => {
          const target = this.characters.find(c => c.id === d.id);
          if (target) {
            if (!target.originPlanet || !target.originPlanet.name) {
              target.originPlanet = d.originPlanet;
            }
            if (!target.transformations || target.transformations.length === 0) {
              target.transformations = d.transformations || [];
            }
          }
        });
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Error completando detalles de personajes:', err);
        this.cdr.detectChanges();
      }
    });
  }
}
