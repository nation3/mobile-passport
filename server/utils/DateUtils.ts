export class DateUtils {

  /**
   * Calculates a Date's epoch timestamp in seconds.  Rounds to the nearest integer to avoid decimals.
   */
  static getTimeInSeconds(date: Date): number {
    console.log('getTimeInSeconds')
    const timeInMilliseconds: number = date.getTime()
    const timeInSeconds: number = timeInMilliseconds / 1000
    const timeInSecondsRoundedToNearestInteger: number = Math.round(timeInSeconds)
    return timeInSecondsRoundedToNearestInteger
  }

  /**
   * Converts from an epoch timestamp (e.g. 1662889385) to Date.
   * 
   * @param timeInSeconds The UNIX timestamp in seconds, e.g. 1662889385.
   */
  static getDate(timeInSeconds: number): Date {
    console.log('getDate')
    const timeInMilliseconds: number = timeInSeconds * 1000
    const date: Date = new Date(timeInMilliseconds)
    return date
  }
}
