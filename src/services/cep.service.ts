import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CepService {

  constructor(private http: HttpClient) { }



  search(value: string) {
    value = value.replace(/[^a-zA-Z0-9 ]/g, '');
    return this.http.get(`https://viacep.com.br/ws/${value}/json/`);
  }
}
