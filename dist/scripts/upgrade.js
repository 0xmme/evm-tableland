"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const assert_1 = __importDefault(require("assert"));
async function main() {
    console.log(`\nUpgrading '${hardhat_1.network.name}' proxy...`);
    // Get proxy owner account
    const [account] = await hardhat_1.ethers.getSigners();
    if (account.provider === undefined) {
        throw Error("missing provider");
    }
    // Get proxy address
    if (hardhat_1.proxy === undefined || hardhat_1.proxy === "") {
        throw Error(`missing proxies entry for '${hardhat_1.network.name}'`);
    }
    console.log(`Using proxy address '${hardhat_1.proxy}'`);
    // Check current implementation
    const impl = await hardhat_1.upgrades.erc1967.getImplementationAddress(hardhat_1.proxy);
    console.log("Current implementation address:", impl);
    // Upgrade proxy
    const Factory = await hardhat_1.ethers.getContractFactory("TablelandTables");
    const tables = await (await hardhat_1.upgrades.upgradeProxy(hardhat_1.proxy, Factory, {
        kind: "uups",
    })).deployed();
    (0, assert_1.default)(tables.address === hardhat_1.proxy, "proxy address changed");
    // Check new implementation
    const impl2 = await hardhat_1.upgrades.erc1967.getImplementationAddress(tables.address);
    console.log("New implementation address:", impl2);
    // Warn if implementation did not change, ie, nothing happened.
    if (impl === impl2) {
        console.warn("\nProxy implementation did not change. Is this expected?");
    }
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
