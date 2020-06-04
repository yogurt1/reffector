import { pipe, OperatorFunction } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

export interface Selector<S, SS> {
  (state: S): SS
}

export interface Compare<T> {
  (a: T, b: T): boolean
}

export function select<S, SS>(selector: Selector<S, SS>, compare?: Compare<SS>): OperatorFunction<S, SS> {
  return pipe(
    map(selector),
    distinctUntilChanged(compare)
  )
}