export interface NextReducerObserver<S, T> {
  next(state: S, value: T): S;
  error?(state: S, error: any): S;
  complete?(state: S): S;
}

export interface ErrorReducerObserver<S, T> {
  next?(state: S, value: T): S
  error(state: S, error: any): S;
  complete?(state: S): S;
}

export interface CompletionReducerObserver<S, T> {
  next(state: S, value: T): S
  error(state: S, error: any): S;
  complete(state: S): S;
}

export type PartialReducerObserver<S, T> =
  | NextReducerObserver<S, T>
  | ErrorReducerObserver<S, T>
  | CompletionReducerObserver<S, T>

export type Reducer<S, T> = NextReducerObserver<S, T>['next']
