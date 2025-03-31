import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GetSessionIdParamsService {

  private id: string | null = null;

  constructor(private route: ActivatedRoute) {
    this.extractIdFromUrl();
  }

  private extractIdFromUrl(): void {
    this.route.queryParamMap.subscribe(params => {
      this.id = params.get('id') ?? null;
      // this.id = '555';
      // if (this.id) {
      //   document.cookie = `JSESSIONID=${this.id}; path=/;`;
      // }
      console.log('ID obtenido (query param):', this.id);
      console.log('ID obtenido (query param) QUEMADO:', '123456');
    });
  }

  get sessionId(): any {
    return this.id;
  }
}
