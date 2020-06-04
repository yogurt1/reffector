import { BehaviorSubject, Observable } from 'rxjs';

export class Atom<T> extends Observable<T> {
  private _subject: BehaviorSubject<T>;

  constructor(initialValue: T) {
    super();
    this._subject = new BehaviorSubject(initialValue);
    this.source = this._subject.asObservable();
  }

  set(value: T): void {
    this._subject.next(value);
  }

  get(): T {
    return this._subject.getValue();  
  }
}