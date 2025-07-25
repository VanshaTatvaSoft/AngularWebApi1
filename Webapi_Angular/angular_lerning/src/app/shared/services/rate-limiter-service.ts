import { Injectable } from '@angular/core';
import { interval, Observable, Subject, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RateLimiterService {

  private requestQueue = new Subject<() => void>();
  private rateLimit = 5;
  private intervalMs = 60000 / this.rateLimit;

  constructor() {
    interval(this.intervalMs).subscribe(() => {
      this.requestQueue.pipe(take(1)).subscribe(exec => exec());
    });
  }

  enqueueObservable<T>(observableFactory: () => Observable<T>): Observable<T> {
    return new Observable<T>((observer) => {
      this.requestQueue.next(() => {
        observableFactory().subscribe({
          next: (val) => observer.next(val),
          error: (err) => observer.error(err),
          complete: () => observer.complete(),
        });
      });
    });
  }

}
