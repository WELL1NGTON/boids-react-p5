interface IVector2 {
  x: number;
  y: number;
}

class Vector2 {
  x: number;
  y: number;

  constructor(vector2?: IVector2) {
    this.x = (vector2 && vector2.x) || 0;
    this.y = (vector2 && vector2.y) || 0;
  }

  static add(vect1: IVector2, vect2: IVector2): Vector2 {
    const x = vect1.x + vect2.x;
    const y = vect1.y + vect2.y;
    return new Vector2({ x, y });
  }

  static sub(vect1: IVector2, vect2: IVector2): Vector2 {
    const x = vect1.x - vect2.x;
    const y = vect1.y - vect2.y;
    return new Vector2({ x, y });
  }

  static div(vect: IVector2, divisor: number): Vector2 {
    const x = vect.x / divisor;
    const y = vect.y / divisor;
    return new Vector2({ x, y });
  }

  static mult(vect: IVector2, multiplier: number): Vector2 {
    const x = vect.x * multiplier;
    const y = vect.y * multiplier;
    return new Vector2({ x, y });
  }

  clamped(value: number): Vector2 {
    const magnitude = this.magnitude();
    const x = this.x / (magnitude / value);
    const y = this.y / (magnitude / value);
    return new Vector2({ x, y });
  }

  normalized(): Vector2 {
    const magnitude = this.magnitude();
    const x = this.x / magnitude;
    const y = this.y / magnitude;
    return new Vector2({ x, y });
  }

  magnitude(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  public static random(min: number, max: number) {
    const x = Math.random() * (max - min) + min;
    const y = Math.random() * (max - min) + min;
    return new Vector2({ x, y });
  }

  public static distance(point1: IVector2, point2: IVector2) {
    return Math.sqrt((point2.x - point1.x) ** 2 + (point2.y - point1.y) ** 2);
  }
}

export default Vector2;
