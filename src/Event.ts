import { Observable, Subject } from "rxjs";

export class Event<T = void> extends Observable<T> {
  private _subject: Subject<T>

  constructor() {
    super();
    this._subject = new Subject();
    this.source = this._subject.asObservable();
  }

  emit(value: T): void {
    this._subject.next(value);
  }

  complete(): void {
    this._subject.complete();
  }
}