import { Store, Event } from "../..";

interface AuthState {
  isLoggedIn: boolean;
}

class AuthStore extends Store<AuthState> {
  private _logInEvent: Event;
  private _logOutEvent: Event;

  constructor() {
    super({
      isLoggedIn: false
    });

    this._logInEvent = new Event();
    this._logOutEvent = new Event();
    this.on(this._logInEvent, () => ({ isLoggedIn: true }));
    this.on(this._logOutEvent, () => ({ isLoggedIn: false }));
  }

  logIn() {
    this._logInEvent.emit();
  }

  logOut() {
    this._logOutEvent.emit();
  }
}

function main() {
  const authStore = new AuthStore();
  const output = document.getElementById('output');

  authStore.subscribe(loggedIn => {
    output.innerHTML = loggedIn ? 'yes' : 'no';
  });
}

main();