
export interface Credentials {
  [key: string]: any
}

export interface DispatcherContract<T> {
  register (fn: Handler<T>): any
  dispatch (input: T): any
}

export type Handler<T> = (input: T, next: () => any) => any

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
  private _dispatcher: DispatcherContract<Credentials>

  /**
   * Create a new authentication manager
   * 
   * @param dispatcher The middleware dispatcher
   * @param handlers The handler container
   * @constructor
   * @public
   */
  public constructor (dispatcher: DispatcherContract<Credentials>, handlers = {}) {
    this._dispatcher = dispatcher
    this._handlers = handlers
  }

  /**
   * Register an authenticator.
   * 
   * @param name The handler name.
   * @param handler The authentication handler.
   * @public
   */
  public register (name: string, handler: AuthenticatorContract): this {
    this._dispatcher.register(handler.process.bind(handler))
    this._handlers[name] = handler
    return this
  }

  /**
   * Get a handler by its name.
   * 
   * Will fail if the handler is not already defined.
   * 
   * @param name The handler name.
   * @throws {ReferenceError} if the handler is undefined
   * @public
   */
  public using (name: string): AuthenticatorContract {
    let handler = this._handlers[name]

    if (handler) return handler

    throw new ReferenceError(`Unknown authentication handler: ${name}`)
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
