import { Observable, Unsubscribable, Subscription } from 'rxjs';
import { Atom } from './Atom';
import { PartialReducerObserver, Reducer } from 'types';
import { EventSubscriber } from 'internal/EventSubscriber';

export class Store<S> extends Observable<S> {
  private _atom: Atom<S>;
  private _subscriptions: WeakMap<Observable<any>, Subscription>;

  constructor(initialState: S) {
    super();
    this._atom = new Atom(initialState);
    this._subscriptions = new WeakMap();
    this.source = this._atom;
  }

  getState(): S {
    return this._atom.get();
  }

  on<E>(event$: Observable<E>, reducerOrReducerObserver: Reducer<S, E> | PartialReducerObserver<S, E>): Unsubscribable {
    // unsubscribe previous
    this.off(event$);

    const subscription = event$.subscribe(new EventSubscriber(this._atom, reducerOrReducerObserver));

    if (!subscription.closed) {
      this._subscriptions.set(event$, subscription);

      subscription.add(() => {
        this._subscriptions.delete(event$);
      });
    }
    
    return subscription;
  }

  off(event$: Observable<any>): void {
    const subscription = this._subscriptions.get(event$)

    if (typeof subscription !== 'undefined') {
      subscription.unsubscribe();
    }
  }
}
