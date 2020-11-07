export abstract class ValueObject {
  static create<T = ValueObject>(this: { new (params: T): T }, params: T) {
    const p = new this(params)
    Object.assign(p, params)
    return p
  }
}
