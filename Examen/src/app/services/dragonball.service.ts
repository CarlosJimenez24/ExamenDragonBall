import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponse, Character } from '../models/character.model';

@Injectable({
  providedIn: 'root'
})
export class DragonballService {
  private apiUrl = 'https://dragonball-api.com/api/characters';

  constructor(private http: HttpClient) { }

  // Obtener todos los personajes con paginación
  getCharacters(page: number = 1, limit: number = 10): Observable<APIResponse> {
    const url = `${this.apiUrl}?page=${page}&limit=${limit}`;
    return this.http.get<APIResponse>(url);
  }

  // Obtener personaje por ID
  getCharacterById(id: number): Observable<Character> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Character>(url);
  }

  // Obtener personajes desde una URL específica (para paginación)
  getCharactersFromUrl(url: string): Observable<APIResponse> {
    return this.http.get<APIResponse>(url);
  }
}
