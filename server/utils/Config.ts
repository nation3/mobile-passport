const getEnvironmentVariable = (environmentVariable : string): string => {
  console.log('getEnvironmentVariable', environmentVariable)
  const variable = process.env[environmentVariable]
  if (!variable) {
    throw new Error(`Missing variable: "${environmentVariable}"`)
  } else {
    return variable
  }
}

export const config = {
  chain: getEnvironmentVariable('NEXT_PUBLIC_CHAIN'),
  inpuraApiKey: getEnvironmentVariable('INFURA_ENDPOINT'),
  
  passportAddress: (getEnvironmentVariable('NEXT_PUBLIC_CHAIN') == 'goerli') ? '0x51F728c58697aFf9582cFDe3cBD00EC83E9ae7FC' : '0x3337dac9f251d4e403d6030e18e3cfb6a2cb1333',
  passportIssuerAddress: (getEnvironmentVariable('NEXT_PUBLIC_CHAIN') == 'goerli') ? '0x8c16926819AB30B8b29A8E23F5C230d164337093' : '0x279c0b6bfCBBA977eaF4ad1B2FFe3C208aa068aC',
  
  appleAuthTokenHmacSeed: getEnvironmentVariable('APPLE_AUTH_TOKEN_HMAC_SEED'),
  appleWebServiceUrl: getEnvironmentVariable('APPLE_WEB_SERVICE_URL'),
  appleCACertificatePEM: getEnvironmentVariable('APPLE_CA_CERTIFICATE_PEM'),
  appleCertificatePEM: getEnvironmentVariable('APPLE_CERTIFICATE_PEM'),
  appleCertificateKey: getEnvironmentVariable('APPLE_CERTIFICATE_KEY'),

  // TODO: add google variables
  // googleApplicationCredentials: getEnvironmentVariable('GOOGLE_APPLICATION_CREDENTIALS'),
  // googleWalletIssuerId: getEnvironmentVariable('GOOGLE_WALLET_ISSUER_ID'),
  // googleWalletUserId: getEnvironmentVariable('GOOGLE_WALLET_USER_ID'),
  
  basicAuthUsername: getEnvironmentVariable('BASIC_AUTH_USERNAME'),
  basicAuthPassword: getEnvironmentVariable('BASIC_AUTH_PASSWORD')
}
console.log('config:', config)
