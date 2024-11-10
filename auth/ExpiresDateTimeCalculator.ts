import { ExpiresCalculator } from "./ExpiresCalculator";

export class ExpiresDateTimeCalculator implements ExpiresCalculator {
  constructor(private time_in_future: number) {}

  public getExpirationTime(): number {
    return Date.now() + this.time_in_future;
  }
}
