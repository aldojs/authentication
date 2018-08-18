
export type Credentials = {
  [key: string]: any
}

export interface DispatcherContract {
  dispatch (input: Credentials): any
  use (fn: (input: Credentials, next: () => any) => any): any
}

export interface AuthenticatorContract {
  process (input: Credentials, next: () => any): any
}

/**
 * The authentication manager
 * 
 * @public
 * @class
 */
export class Manager {
  /**
   * The authentication handlers
   * 
   * @private
   */
  private _handlers: {
    [name: string]: AuthenticatorContract
  }

  /**
   * The credentials dispatcher
   * 
   * @private
   */
  private _dispatcher: DispatcherContract

  /**
   * Create a new authentication manager
   * 
   * @param dispatcher The middleware dispatcher
   * @param handlers The handler container
   * @constructor
   * @public
   */
  public constructor (dispatcher: DispatcherContract, handlers = {}) {
    this._dispatcher = dispatcher
    this._handlers = handlers
  }

  /**
   * Use an authenticator
   * 
   * @param handler The authentication handler
   * @public
   */
  public use (name: string, handler: AuthenticatorContract): this {
    this._dispatcher.use((a, b) => handler.process(a, b))
    this._handlers[name] = handler
    return this
  }

  /**
   * Attempt to authenticate a user using the given credentials
   * 
   * Will invoke the registered handlers, and return the authenticated user
   * 
   * @public
   * @async
   */
  public attempt (credentials: Credentials): any {
    return this._dispatcher.dispatch(credentials)
  }
}
