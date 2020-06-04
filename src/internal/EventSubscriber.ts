import { Subscriber } from 'rxjs';
import { Reducer, PartialReducerObserver } from '../types';
import { Atom } from '../Atom';

export class EventSubscriber<S, T> extends Subscriber<any> {
  private _atom: Atom<S>;
  private _nextReducer?: Reducer<S, T>;
  private _errorReducer?: Reducer<S, any>;
  private _completionReducer?: Reducer<S, void>;

  constructor(
    atom: Atom<S>,
    reducerOrReducerObserver: Reducer<S, T> | PartialReducerObserver<S, T>,
  ) {
    super();
    this._atom = atom;

    if (typeof reducerOrReducerObserver === 'function') {
      this._nextReducer = reducerOrReducerObserver;
    } else {
      this._nextReducer = reducerOrReducerObserver.next;
      this._errorReducer = reducerOrReducerObserver.error;
      this._completionReducer = reducerOrReducerObserver.complete;
    }
  }

  _applyReducer(reducer: Reducer<S, any>, value: any): void {
    const currentState = this._atom.get();
    const newState = reducer(currentState, value);
    this._atom.set(newState);
  }

  _next(value: T): void {
    if (this._nextReducer) {
      this._applyReducer(this._nextReducer, value);
    }
  }

  _error(error: any): void {
    if (this._errorReducer) {
      this._applyReducer(this._errorReducer, error);
    }
  }

  _complete(): void {
    if (this._completionReducer) {
      this._applyReducer(this._completionReducer, void 0);
    }
  }
}
