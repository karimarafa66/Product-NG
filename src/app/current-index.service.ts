import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrentIndexService {

  constructor() { }
  private currentIndexSubject = new BehaviorSubject<number>(0);
  private currentLengthSubject = new BehaviorSubject<number>(0);

  getCurrentIndex(): Observable<number> {
    return this.currentIndexSubject.asObservable();
  }

  updateCurrentIndex(index: number): void {
    this.currentIndexSubject.next(index);
  }
  getCurrentLength(): Observable<number> {
    return this.currentLengthSubject.asObservable();
  }

  updateCurrentLength(length: number): void {
    this.currentLengthSubject.next(length);
  }
  getIndex(){
    return this.currentIndexSubject.getValue()
  }
}
