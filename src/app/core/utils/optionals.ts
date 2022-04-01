export class Optionals<T> {
  private value: T;

  private constructor(v: T) {
    this.value = v;
  }

  static of<T>(v: T): Optionals<T> {
    return new Optionals<T>(v);
  }

  ifPresent(closure) {
    closure(this.value);
  }

  getOrElse(otherValue: T) {
    return this.value || otherValue;
  }

  map<V>(closure): Optionals<V> {
    return this.isPresent() ? Optionals.of(closure(this.value)) : this;
  }

  isPresent(): boolean {
    return this.value !== undefined && this.value !== null;
  }
}
