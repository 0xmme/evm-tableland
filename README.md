# Table of Contents

- [Background](#background)
- [Development](#development)
- [License](#license)

# Background

This is a evm-tableland clone for creating sampledata and later on fetching this data with the tablelandsdk.

## Currently supported chains

```
Optimism Kovan | 69 | 0xf2C9Fc73884A9c6e6Db58778176Ab67989139D06

Optimism Goerli | 420 | 0xC72E8a7Be04f2469f8C2dB3F1BdF69A7D516aBbA
```

# Development

## Building the client

You can build the Typescript client locally:

```shell
npm install
npx hardhat compile
npm run build
```

## Testing

Run the test suite:

```shell
npm test
```

Test with gas reporting:

```shell
REPORT_GAS=true npx hardhat test
```

## Deploying

Deployments are handled on a per-network basis:

```shell
npx hardhat run scripts/deploy.ts --network optimism-kovan
```

Refer to the `proxies` entry in `hardhat.config.js` for the list of current deployments.

# License

MIT
