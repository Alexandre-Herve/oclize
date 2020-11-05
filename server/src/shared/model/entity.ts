export abstract class Entity<T> {
  constructor(protected readonly _id: string, protected _props: T) {}

  get props() {
    return this._props
  }

  get id() {
    return this._id
  }
}
