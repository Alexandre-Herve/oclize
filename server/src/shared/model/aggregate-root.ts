import { Entity } from './entity'
import { EntityProps } from './entity-props'

export abstract class AggregateRoot<T extends EntityProps> extends Entity<T> {}
