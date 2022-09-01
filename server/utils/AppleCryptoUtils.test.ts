require('dotenv').config({ path: './.env.local.goerli' })
import { describe, expect, test } from '@jest/globals'
import { AppleCryptoUtils } from './AppleCryptoUtils'

test('calculateSha1Hash', () => {
  const filePath : string = './template-versions/apple/1/icon.png'
  const actual : string = AppleCryptoUtils.calculateSha1Hash(filePath)
  expect(actual).toBe('a9ce8210a5a240f8e6dd272ac395b26b33b6c7c1')
}),

test('generateManifestObject v1', () => {
  const templateVersionDir : string = './template-versions/apple/1'
  const manifestObject : JSON = AppleCryptoUtils.generateManifestObject(templateVersionDir)
  expect(JSON.stringify(manifestObject)).toContain('icon.png')
  expect(JSON.stringify(manifestObject)).toContain('icon@2x.png')
  expect(JSON.stringify(manifestObject)).toContain('logo.png')
  expect(JSON.stringify(manifestObject)).toContain('logo@2x.png')
  expect(JSON.stringify(manifestObject)).toContain('logo@3x.png')
  expect(JSON.stringify(manifestObject)).toContain('pass.json')
  expect(JSON.stringify(manifestObject)).toContain('strip.png')
  expect(JSON.stringify(manifestObject)).toContain('strip@2x.png')
  expect(JSON.stringify(manifestObject)).toContain('strip@3x.png')
})

test('generateManifestObject v2', () => {
  const templateVersionDir : string = './template-versions/apple/2'
  const manifestObject : JSON = AppleCryptoUtils.generateManifestObject(templateVersionDir)
  expect(JSON.stringify(manifestObject)).toContain('icon.png')
  expect(JSON.stringify(manifestObject)).toContain('icon@2x.png')
  expect(JSON.stringify(manifestObject)).toContain('logo.png')
  expect(JSON.stringify(manifestObject)).toContain('logo@2x.png')
  expect(JSON.stringify(manifestObject)).toContain('logo@3x.png')
  expect(JSON.stringify(manifestObject)).toContain('pass.json')
  expect(JSON.stringify(manifestObject)).toContain('strip.png')
  expect(JSON.stringify(manifestObject)).toContain('strip@2x.png')
  expect(JSON.stringify(manifestObject)).toContain('strip@3x.png')
})
