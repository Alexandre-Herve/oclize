import { EntityProps } from './entity-props'

export abstract class Entity<T extends EntityProps> {
  constructor(protected _props: T) {}

  get props() {
    return this._props
  }

  set props(props: T) {
    this._props = props
  }

  get id() {
    return this._props.id
  }
}
