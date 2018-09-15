
import { Contracts, Manager } from './manager'

/**
 * Create a new authentication manager
 * 
 * @param dispatcher The credentials dispatcher
 * @param handlers The authentication handlers
 */
export function createManager (dispatcher: Contracts.Dispatcher, handlers = new Map()) {
  return new Manager(dispatcher, handlers)
}
