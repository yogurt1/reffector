# Reffector

Стейт-менеджер на базе Rx.js

Вдохновлен Effector

## API

### Atom

Простая обертка над **BehaviorSubject**, реализует интерфейс **Observable** + методы **get** и **set**

```javascript
import { Atom } from 'reffector';

const atom = new Atom(0);

atom.subscribe(value => console.log(value)); // prints 0

atom.set(2); // prints 2

atom.set(4); // prints 4
```

### Store

Обертка над **Atom**, добавляет возможность подписки на события через **on** и отписки через **off**, реализует интерфейс **Observable**

```typescript
import { Store } from 'reffector';

const store = new Store<number>(0);

const add = new Subject<number>();
const reset = new Subject<void>();

// listen observables
store.on(add, (state, payload) => state + payload);
store.on(reset, () => 0);

store.subscribe(value => console.log(value)); // prints 0

add.next(4); // prints 4

reset.next(); // prints 0

// unsubscribe add event
// add.complete() same effect
store.off(add);

add.next(5); // no changes to store
```

### Event

Обертка над **Subject**, добавляет метод **emit** для генерации события, реализует интерфейс **Observable**

```typescript
import { Event } from 'reffector';

const someEvent = new Event<string>();

someEvent.subscribe(value => console.log(value));

someEvent.emit('a'); // prints a
someEvent.emit('b'); // prints b
```

### Все вместе

```typescript
import { interval } from 'rxjs';
import { exhaustMap, switchMap } from 'fetch';
import { fromFetch } from 'rxjs/fetch';
import { Atom, Event, Store } from 'reffector';

interface AppState {
  isLoggedIn: boolean;
}

const appStore = new Store<AppState>({
  isLoggedIn: false,
});

// call login every second
const logIn$ = interval(1000).pipe(
  exhaustMap(() => fromFetch('/login').pipe(
    switchMap(response => response.json()),
    tap({
      error: error => {
        // send error to sentry
      },
    }),
  )),
);

appStore.on(logIn$, {
  next: (_, isLoggedIn: boolean) => ({ isLoggedIn }),
  // error and complete also reducers
});

appStore.subscribe(state => {
  console.log('new state:', state);
});
```

------

This project was bootstrapped with [TSDX](https://github.com/jaredpalmer/tsdx).

## Local Development

Below is a list of commands you will probably find useful.

### `npm start` or `yarn start`

Runs the project in development/watch mode. Your project will be rebuilt upon changes. TSDX has a special logger for you convenience. Error messages are pretty printed and formatted for compatibility VS Code's Problems tab.

<img src="https://user-images.githubusercontent.com/4060187/52168303-574d3a00-26f6-11e9-9f3b-71dbec9ebfcb.gif" width="600" />

Your library will be rebuilt if you make edits.

### `npm run build` or `yarn build`

Bundles the package to the `dist` folder.
The package is optimized and bundled with Rollup into multiple formats (CommonJS, UMD, and ES Module).

<img src="https://user-images.githubusercontent.com/4060187/52168322-a98e5b00-26f6-11e9-8cf6-222d716b75ef.gif" width="600" />

### `npm test` or `yarn test`

Runs the test watcher (Jest) in an interactive mode.
By default, runs tests related to files changed since the last commit.
