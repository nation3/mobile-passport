require('dotenv').config({ path: './.env.local.goerli' })
import { describe, expect, test } from '@jest/globals'
import { Platform } from '../interfaces'
import { config } from './Config'
import { Passes } from './Passes'
import fs from 'fs'

test('generatePass - Apple v1', () => {
  const platform: Platform = Platform.Apple
  const templateVersion: number = 1
  const passportID: string = Math.floor(1 + (Math.random() * 840)).toString() // [1, 840]
  const issueDateTimestamp: number = 1662541136 // September 7, 2022 8:58:56 AM
  const address: string = '0x394b00B5De4E6f30292aCaC37f810Dd0672E211E'
  const ensName: string = 'vitalik.eth'
  const filePath: string = Passes.generatePass(
    platform,
    templateVersion,
    passportID,
    issueDateTimestamp,
    address,
    ensName
  )
  expect(filePath).toContain('passport_0x394b00B5De4E6f30292aCaC37f810Dd0672E211E.pkpass')
  expect(fs.existsSync(filePath)).toBe(true)
})

test('generatePass - Apple v2', () => {
  const platform: Platform = Platform.Apple
  const templateVersion: number = 2
  const passportID: string = Math.floor(1 + (Math.random() * 840)).toString() // [1, 840]
  const issueDateTimestamp: number = 1662541136 // September 7, 2022 8:58:56 AM
  const address: string = '0x394b00B5De4E6f30292aCaC37f810Dd0672E211E'
  const ensName: string = 'vitalik.eth'
  const filePath: string = Passes.generatePass(
    platform,
    templateVersion,
    passportID,
    issueDateTimestamp,
    address,
    ensName
  )
  expect(filePath).toContain('passport_0x394b00B5De4E6f30292aCaC37f810Dd0672E211E.pkpass')
  expect(fs.existsSync(filePath)).toBe(true)
})
