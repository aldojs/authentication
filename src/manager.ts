
export namespace Contracts {
  export interface Dispatcher {
    dispatch (input: object): any
    register (fn: Handler): any
  }

  export interface Map {
    get (name: string): Authenticator | undefined
    set (name: string, handler: Authenticator): any
  }

  export interface Authenticator {
    process (credentials: object, next: () => any): any
  }

  export type Handler = (input: object, next: () => any) => any
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
  private _handlers: Contracts.Map

  /**
   * The credentials dispatcher
   * 
   * @private
   */
  private _dispatcher: Contracts.Dispatcher

  /**
   * Create a new authentication manager
   * 
   * @param dispatcher The middleware dispatcher
   * @param handlers The handler container
   * @constructor
   * @public
   */
  public constructor (dispatcher: Contracts.Dispatcher, handlers: Contracts.Map) {
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
  public register (name: string, handler: Contracts.Authenticator): this {
    this._dispatcher.register(handler.process.bind(handler))
    this._handlers.set(name, handler)
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
  public using (name: string): Contracts.Authenticator {
    let handler = this._handlers.get(name)

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
  public attempt (credentials: object): any {
    return this._dispatcher.dispatch(credentials)
  }
}
