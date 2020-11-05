export abstract class Props {
  static create<T = Props>(this: { new (params: T): T }, params: T) {
    const p = new this(params)
    Object.assign(p, params)
    return p
  }
}
