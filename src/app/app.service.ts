import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {interval} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AppService {
  baseUrl: string = "http://localhost:5000";
  pollInterval = interval(10000);

  constructor(private http: HttpClient) { }

  getStatus(){
    return this.http.get(`${this.baseUrl}/status`)
  }

  toggle(node:number){
    return this.http.post(`${this.baseUrl}/toggle/${node}`, {})
  }
}
