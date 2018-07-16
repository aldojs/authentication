
export type Credentials = {
  [key: string]: any
}

export interface DispatcherContract {
  dispatch (input: Credentials): any
  use (handler: AuthenticatorContract): any
}

export interface AuthenticatorContract {
  attempt (obj: Credentials): any
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
   * @param dispatcher The dispatcher
   * @param handlers The handler stack
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
   * @param handler The authenticator
   * @public
   */
  public use (name: string, handler: AuthenticatorContract): this {
    this._dispatcher.use(handler)
    return this
  }

  /**
   * 
   * 
   * @public
   * @async
   */
  public attempt (credentials: Credentials): any {
    return this._dispatcher.dispatch(credentials)
  }
}
