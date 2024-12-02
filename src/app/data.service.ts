import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  filePath: string = '/assets/data/data.json';
  constructor(private http: HttpClient) {}

  readJsonFile(): Observable<any> {
    return this.http
      .get(this.filePath)
      .pipe(map((response) => response as any));
  }

  private videoKey: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private notice: BehaviorSubject<any> = new BehaviorSubject<any>(0);

  private arraySubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  array$: Observable<any[]> = this.arraySubject.asObservable();
  updateImages(newArray: any[]) {
    this.arraySubject.next(newArray);
  }
  getImages() {
    return this.arraySubject.getValue();
  }

  updateVideoKey(key: any) {
    this.videoKey.next(key);
  }
  getVideoKey() {
    return this.videoKey.getValue();
  }

  updateNotice(notice: any) {
    this.notice.next(notice);
  }
  getNotice() {
    return this.notice.asObservable();
  }
}
