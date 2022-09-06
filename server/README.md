# Pass Server

Next.js server for REST API.

## Install the packages

```
npm install
```

## Unit Testing

Run unit tests:
```
npm run test
```

## Add the file with local environment variables

```
cp .env.local.goerli .env.local
```
or
```
cp .env.local.mainnet .env.local
```

## Run the development server

```
npm run dev
```

http://localhost:3000

## Integration Testing

Run the integration tests:
```
npm run cy
```

Run the integration tests headlessly:
```
npm run cy:headless
```

## Create production build

```
npm run build
```
