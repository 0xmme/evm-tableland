import { HardhatUserConfig } from "hardhat/config";
import "@openzeppelin/hardhat-upgrades";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "hardhat-contract-sizer";
import "solidity-coverage";
import { ProxyAddresses } from "./proxies";
declare const config: HardhatUserConfig;
interface TablelandNetworkConfig {
    ethereum: string;
    optimism: string;
    polygon: string;
    "ethereum-goerli": string;
    "optimism-goerli": string;
    "polygon-mumbai": string;
    "optimism-goerli-staging": string;
    localhost: string;
}
declare module "hardhat/types/config" {
    interface HardhatUserConfig {
        baseURIs: TablelandNetworkConfig;
        proxies: ProxyAddresses;
    }
}
declare module "hardhat/types/runtime" {
    interface HardhatRuntimeEnvironment {
        baseURI: string;
        proxy: string;
    }
}
export default config;
