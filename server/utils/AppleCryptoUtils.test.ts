require('dotenv').config({ path: './.env.local.goerli' })
import { describe, expect, test } from '@jest/globals'
import { AppleCryptoUtils } from './AppleCryptoUtils'

test('calculateSha1Hash', () => {
  const filePath = './template-versions/apple/1/icon.png'
  const actual = AppleCryptoUtils.calculateSha1Hash(filePath)
  expect(actual).toBe('a9ce8210a5a240f8e6dd272ac395b26b33b6c7c1')
})
