require('dotenv').config({ path: './.env.local.goerli' })
import { describe, expect, test } from '@jest/globals'
import { AppleCryptoUtils } from './AppleCryptoUtils'
import fs from 'fs'

test('calculateSha1Hash', () => {
  const filePath : string = './template-versions/apple/1/icon.png'
  const actual : string = AppleCryptoUtils.calculateSha1Hash(filePath)
  expect(actual).toBe('a9ce8210a5a240f8e6dd272ac395b26b33b6c7c1')
})

test('generateManifestObject v1', () => {
  const templateVersionDir : string = './template-versions/apple/1'
  const manifestObject : JSON = AppleCryptoUtils.generateManifestObject(templateVersionDir)
  const manifestObjectStringified = JSON.stringify(manifestObject)
  expect(manifestObjectStringified).toContain('icon.png')
  expect(manifestObjectStringified).toContain('icon@2x.png')
  expect(manifestObjectStringified).toContain('logo.png')
  expect(manifestObjectStringified).toContain('logo@2x.png')
  expect(manifestObjectStringified).toContain('logo@3x.png')
  expect(manifestObjectStringified).toContain('pass.json')
  expect(manifestObjectStringified).toContain('strip.png')
  expect(manifestObjectStringified).toContain('strip@2x.png')
  expect(manifestObjectStringified).toContain('strip@3x.png')
})

test('generateManifestObject v2', () => {
  const templateVersionDir : string = './template-versions/apple/2'
  const manifestObject : JSON = AppleCryptoUtils.generateManifestObject(templateVersionDir)
  const manifestObjectStringified = JSON.stringify(manifestObject)
  expect(manifestObjectStringified).toContain('icon.png')
  expect(manifestObjectStringified).toContain('icon@2x.png')
  expect(manifestObjectStringified).toContain('logo.png')
  expect(manifestObjectStringified).toContain('logo@2x.png')
  expect(manifestObjectStringified).toContain('logo@3x.png')
  expect(manifestObjectStringified).toContain('pass.json')
  expect(manifestObjectStringified).toContain('strip.png')
  expect(manifestObjectStringified).toContain('strip@2x.png')
  expect(manifestObjectStringified).toContain('strip@3x.png')
})

test('generateManifestObject v3', () => {
  const templateVersionDir : string = './template-versions/apple/3'
  const manifestObject : JSON = AppleCryptoUtils.generateManifestObject(templateVersionDir)
  const manifestObjectStringified = JSON.stringify(manifestObject)
  expect(manifestObjectStringified).toContain('icon.png')
  expect(manifestObjectStringified).toContain('icon@2x.png')
  expect(manifestObjectStringified).toContain('logo.png')
  expect(manifestObjectStringified).toContain('logo@2x.png')
  expect(manifestObjectStringified).toContain('logo@3x.png')
  expect(manifestObjectStringified).toContain('pass.json')
  expect(manifestObjectStringified).toContain('strip.png')
  expect(manifestObjectStringified).toContain('strip@2x.png')
  expect(manifestObjectStringified).toContain('strip@3x.png')
})

test('generateAuthenticationToken - number 5', () => {
  const templateVersionDir: string = './template-versions/apple/3'
  const passJson = JSON.parse(fs.readFileSync(templateVersionDir + '/pass.json', 'utf-8'))
  passJson.serialNumber = 5
  const authenticationToken: string = AppleCryptoUtils.generateAuthenticationToken(passJson.serialNumber)
  expect(authenticationToken).toEqual('0x7b3800fa512a81d1e0619ec255ddcc706983c913581e09472961075c8d7b9dab')
})

test('generateAuthenticationToken - string "5"', () => {
  const templateVersionDir: string = './template-versions/apple/3'
  const passJson = JSON.parse(fs.readFileSync(templateVersionDir + '/pass.json', 'utf-8'))
  passJson.serialNumber = '5'
  const authenticationToken: string = AppleCryptoUtils.generateAuthenticationToken(passJson.serialNumber)
  expect(authenticationToken).toEqual('0x7b3800fa512a81d1e0619ec255ddcc706983c913581e09472961075c8d7b9dab')
})

test('generateAuthenticationToken - number 55555', () => {
  const templateVersionDir: string = './template-versions/apple/3'
  const passJson = JSON.parse(fs.readFileSync(templateVersionDir + '/pass.json', 'utf-8'))
  passJson.serialNumber = 55555
  const authenticationToken: string = AppleCryptoUtils.generateAuthenticationToken(passJson.serialNumber)
  expect(authenticationToken).toEqual('0xe31bcc7bf703fe106a757e41df3ba761daac89cb007cebfcce8ab3b3efa803b0')
})

test('generateAuthenticationToken - string "55555"', () => {
  const templateVersionDir: string = './template-versions/apple/3'
  const passJson = JSON.parse(fs.readFileSync(templateVersionDir + '/pass.json', 'utf-8'))
  passJson.serialNumber = '55555'
  const authenticationToken: string = AppleCryptoUtils.generateAuthenticationToken(passJson.serialNumber)
  expect(authenticationToken).toEqual('0xe31bcc7bf703fe106a757e41df3ba761daac89cb007cebfcce8ab3b3efa803b0')
})
