import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DragonballService } from '../../services/dragonball.service';
import { Character } from '../../models/character.model';

@Component({
  selector: 'app-personaje-detalles-component',
  imports: [CommonModule, RouterLink],
  templateUrl: './personaje-detalles-component.html',
  styleUrl: './personaje-detalles-component.css',
})
export class PersonajeDetallesComponent implements OnInit {
  character: Character | null = null;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private dragonballService: DragonballService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCharacter(+id);
    }
  }

  loadCharacter(id: number): void {
    this.isLoading = true;
    this.dragonballService.getCharacterById(id).subscribe({
      next: (character: Character) => {
        this.character = character;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar personaje:', error);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getKiPercentage(ki: string, maxKi: string): number {
    const kiValue = parseFloat(ki.replace(/,/g, ''));
    const maxKiValue = parseFloat(maxKi.replace(/,/g, ''));
    
    if (isNaN(kiValue) || isNaN(maxKiValue) || maxKiValue === 0) {
      return 0;
    }
    
    return (kiValue / maxKiValue) * 100;
  }
}
