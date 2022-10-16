import { describe, expect, test } from '@jest/globals'
import { DateUtils } from './DateUtils'

describe('getTimeInSeconds', () => {
  test('getTimeInSeconds - 2022-09-30T04:12:17Z', () => {
    const date: Date = new Date('2022-09-30T04:12:17Z')
    console.log('date:', date)
    expect(DateUtils.getTimeInSeconds(date)).toBe(1664511137)
  })

  test('getTimeInSeconds - 2022-09-30T04:12:17.000Z', () => {
    const date: Date = new Date('2022-09-30T04:12:17.000Z')
    console.log('date:', date)
    expect(DateUtils.getTimeInSeconds(date)).toBe(1664511137)
  })

  test('getTimeInSeconds - 2022-09-30T04:12:17.499Z', () => {
    const date: Date = new Date('2022-09-30T04:12:17.499Z')
    console.log('date:', date)
    expect(DateUtils.getTimeInSeconds(date)).toBe(1664511137)
  })

  test('getTimeInSeconds - 2022-09-30T04:12:17.500Z', () => {
    const date: Date = new Date('2022-09-30T04:12:17.500Z')
    console.log('date:', date)
    expect(DateUtils.getTimeInSeconds(date)).toBe(1664511138)
  })
})

describe('getDate', () => {
  test('getDate - 1662889385', () => {
    const date: Date = DateUtils.getDate(1662889385)
    console.log('date:', date)
    expect(date.toISOString()).toBe('2022-09-11T09:43:05.000Z')
  })
})
