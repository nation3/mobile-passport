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
  const latestUpdateTitle: string = 'N3GOV-15: Set Nation3\’s North Star metrics'
  const latestUpdateContent: string = 'A North Star metric is paramount since it aligns everyone in the nation towards a particular, measurable goal.'
  const filePath: string = Passes.generatePass(
    platform,
    templateVersion,
    passportID,
    issueDateTimestamp,
    address,
    ensName,
    latestUpdateTitle,
    latestUpdateContent
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
  const latestUpdateTitle: string = 'N3GOV-15: Set Nation3\’s North Star metrics'
  const latestUpdateContent: string = 'A North Star metric is paramount since it aligns everyone in the nation towards a particular, measurable goal.'
  const filePath: string = Passes.generatePass(
    platform,
    templateVersion,
    passportID,
    issueDateTimestamp,
    address,
    ensName,
    latestUpdateTitle,
    latestUpdateContent
  )
  expect(filePath).toContain('passport_0x394b00B5De4E6f30292aCaC37f810Dd0672E211E.pkpass')
  expect(fs.existsSync(filePath)).toBe(true)
})

test('generatePass - Apple v2 - no ENS name', () => {
  const platform: Platform = Platform.Apple
  const templateVersion: number = 2
  const passportID: string = Math.floor(1 + (Math.random() * 840)).toString() // [1, 840]
  const issueDateTimestamp: number = 1662541136 // September 7, 2022 8:58:56 AM
  const address: string = '0x394b00B5De4E6f30292aCaC37f810Dd0672E211E'
  const ensName: string = ''
  const latestUpdateTitle: string = 'N3GOV-15: Set Nation3\’s North Star metrics'
  const latestUpdateContent: string = 'A North Star metric is paramount since it aligns everyone in the nation towards a particular, measurable goal.'
  const filePath: string = Passes.generatePass(
    platform,
    templateVersion,
    passportID,
    issueDateTimestamp,
    address,
    ensName,
    latestUpdateTitle,
    latestUpdateContent
  )
  expect(filePath).toContain('passport_0x394b00B5De4E6f30292aCaC37f810Dd0672E211E.pkpass')
  expect(fs.existsSync(filePath)).toBe(true)
})

test('generatePass - Apple v3', () => {
  const platform: Platform = Platform.Apple
  const templateVersion: number = 3
  const passportID: string = Math.floor(1 + (Math.random() * 840)).toString() // [1, 840]
  const issueDateTimestamp: number = 1662541136 // September 7, 2022 8:58:56 AM
  const address: string = '0x394b00B5De4E6f30292aCaC37f810Dd0672E211E'
  const ensName: string = 'vitalik.eth'
  const latestUpdateTitle: string = 'N3GOV-15: Set Nation3\’s North Star metrics'
  const latestUpdateContent: string = 'A North Star metric is paramount since it aligns everyone in the nation towards a particular, measurable goal.'
  const filePath: string = Passes.generatePass(
    platform,
    templateVersion,
    passportID,
    issueDateTimestamp,
    address,
    ensName,
    latestUpdateTitle,
    latestUpdateContent
  )
  expect(filePath).toContain('passport_0x394b00B5De4E6f30292aCaC37f810Dd0672E211E.pkpass')
  expect(fs.existsSync(filePath)).toBe(true)
})

test('generatePass - Apple v3 - no ENS name', () => {
  const platform: Platform = Platform.Apple
  const templateVersion: number = 3
  const passportID: string = Math.floor(1 + (Math.random() * 840)).toString() // [1, 840]
  const issueDateTimestamp: number = 1662541136 // September 7, 2022 8:58:56 AM
  const address: string = '0x394b00B5De4E6f30292aCaC37f810Dd0672E211E'
  const ensName: string = ''
  const latestUpdateTitle: string = 'N3GOV-15: Set Nation3\’s North Star metrics'
  const latestUpdateContent: string = 'A North Star metric is paramount since it aligns everyone in the nation towards a particular, measurable goal.'
  const filePath: string = Passes.generatePass(
    platform,
    templateVersion,
    passportID,
    issueDateTimestamp,
    address,
    ensName,
    latestUpdateTitle,
    latestUpdateContent
  )
  expect(filePath).toContain('passport_0x394b00B5De4E6f30292aCaC37f810Dd0672E211E.pkpass')
  expect(fs.existsSync(filePath)).toBe(true)
})

test('notifyPassesAboutLastUpdate - Platform.Google', async () => {
  const platform: Platform = Platform.Google
  try {
    await Passes.notifyPassesAboutLastUpdate(platform)
  } catch (err: any) {
    expect(err.message).toContain('Platform not yet implemented')
  }
})
