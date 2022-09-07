"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const config_1 = require("hardhat/config");
require("@openzeppelin/hardhat-upgrades");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("@typechain/hardhat");
require("hardhat-gas-reporter");
require("hardhat-contract-sizer");
require("solidity-coverage");
const proxies_1 = require("./proxies");
dotenv.config();
const config = {
    solidity: {
        version: "0.8.4",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    contractSizer: {
        alphaSort: true,
        disambiguatePaths: false,
        runOnCompile: false,
        strict: true,
        only: [],
    },
    gasReporter: {
        enabled: process.env.REPORT_GAS !== undefined,
        currency: "USD",
    },
    etherscan: {
        apiKey: {
            // ethereum
            mainnet: process.env.ETHERSCAN_API_KEY || "",
            goerli: process.env.ETHERSCAN_API_KEY || "",
            // optimism
            optimisticEthereum: process.env.OPTIMISM_ETHERSCAN_API_KEY || "",
            optimisticKovan: process.env.OPTIMISM_ETHERSCAN_API_KEY || "",
            // polygon
            polygon: process.env.POLYSCAN_API_KEY || "",
            polygonMumbai: process.env.POLYSCAN_API_KEY || "",
        },
    },
    defaultNetwork: "localhost",
    networks: {
        // mainnets
        ethereum: {
            url: `https://eth-mainnet.alchemyapi.io/v2/${(_a = process.env.ETHEREUM_API_KEY) !== null && _a !== void 0 ? _a : ""}`,
            accounts: process.env.ETHEREUM_PRIVATE_KEY !== undefined
                ? [process.env.ETHEREUM_PRIVATE_KEY]
                : [],
        },
        optimism: {
            url: `https://opt-mainnet.g.alchemy.com/v2/${(_b = process.env.OPTIMISM_API_KEY) !== null && _b !== void 0 ? _b : ""}`,
            accounts: process.env.OPTIMISM_PRIVATE_KEY !== undefined
                ? [process.env.OPTIMISM_PRIVATE_KEY]
                : [],
        },
        polygon: {
            url: `https://polygon-mainnet.g.alchemy.com/v2/${(_c = process.env.POLYGON_API_KEY) !== null && _c !== void 0 ? _c : ""}`,
            accounts: process.env.POLYGON_PRIVATE_KEY !== undefined
                ? [process.env.POLYGON_PRIVATE_KEY]
                : [],
        },
        // testnets
        "ethereum-goerli": {
            url: `https://eth-goerli.alchemyapi.io/v2/${(_d = process.env.ETHEREUM_GOERLI_API_KEY) !== null && _d !== void 0 ? _d : ""}`,
            accounts: process.env.ETHEREUM_GOERLI_PRIVATE_KEY !== undefined
                ? [process.env.ETHEREUM_GOERLI_PRIVATE_KEY]
                : [],
        },
        "optimism-goerli": {
            url: `https://opt-goerli.g.alchemy.com/v2/${(_e = process.env.OPTIMISM_GOERLI_API_KEY) !== null && _e !== void 0 ? _e : ""}`,
            accounts: process.env.OPTIMISM_GOERLI_PRIVATE_KEY !== undefined
                ? [process.env.OPTIMISM_GOERLI_PRIVATE_KEY]
                : [],
        },
        "polygon-mumbai": {
            url: `https://polygon-mumbai.g.alchemy.com/v2/${(_f = process.env.POLYGON_MUMBAI_API_KEY) !== null && _f !== void 0 ? _f : ""}`,
            accounts: process.env.POLYGON_MUMBAI_PRIVATE_KEY !== undefined
                ? [process.env.POLYGON_MUMBAI_PRIVATE_KEY]
                : [],
        },
        // devnets
        "optimism-goerli-staging": {
            url: `https://opt-goerli.g.alchemy.com/v2/${(_g = process.env.OPTIMISM_GOERLI_STAGING_API_KEY) !== null && _g !== void 0 ? _g : ""}`,
            accounts: process.env.OPTIMISM_GOERLI_STAGING_PRIVATE_KEY !== undefined
                ? [process.env.OPTIMISM_GOERLI_STAGING_PRIVATE_KEY]
                : [],
        },
        hardhat: {
            mining: {
                auto: !(process.env.HARDHAT_DISABLE_AUTO_MINING === "true"),
                interval: [100, 3000],
            },
        },
        localhost: {
            url: "http://127.0.0.1:8545/",
        },
    },
    baseURIs: {
        // mainnets
        ethereum: "https://testnet.tableland.network/chain/1/tables/",
        optimism: "https://testnet.tableland.network/chain/10/tables/",
        polygon: "https://testnet.tableland.network/chain/137/tables/",
        // testnets
        "ethereum-goerli": "https://testnet.tableland.network/chain/5/tables/",
        "optimism-goerli": "https://testnet.tableland.network/chain/420/tables/",
        "polygon-mumbai": "https://testnet.tableland.network/chain/80001/tables/",
        // devnets
        "optimism-goerli-staging": "https://staging.tableland.network/chain/420/tables/",
        localhost: "http://localhost:8080/chain/31337/tables/",
    },
    proxies: proxies_1.proxies,
};
(0, config_1.extendEnvironment)((hre) => {
    // Get base URI for user-selected network
    const uris = hre.userConfig.baseURIs;
    hre.baseURI = uris[hre.network.name];
    // Get proxy address for user-selected network
    const proxies = hre.userConfig.proxies;
    hre.proxy = proxies[hre.network.name];
});
exports.default = config;
