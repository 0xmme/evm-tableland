"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const assert_1 = __importDefault(require("assert"));
async function main() {
    var _a, _b, _c;
    console.log(`\nDeploying new proxy to '${hardhat_1.network.name}'...`);
    // Get proxy owner account
    const [account] = await hardhat_1.ethers.getSigners();
    if (account.provider === undefined) {
        throw Error("missing provider");
    }
    // Get base URI
    if (hardhat_1.baseURI === undefined || hardhat_1.baseURI === "") {
        throw Error(`missing baseURIs entry for '${hardhat_1.network.name}'`);
    }
    console.log(`Using base URI '${hardhat_1.baseURI}'`);
    // Don't allow multiple proxies per network
    if (hardhat_1.proxy !== undefined && hardhat_1.proxy !== "") {
        throw Error(`proxy already deployed to '${hardhat_1.network.name}'`);
    }
    // Deploy proxy
    const Factory = await hardhat_1.ethers.getContractFactory("TablelandTables");
    const tables = await (await hardhat_1.upgrades.deployProxy(Factory, [hardhat_1.baseURI], {
        kind: "uups",
    })).deployed();
    console.log("New proxy address:", tables.address);
    // Check new implementation
    const impl = await hardhat_1.upgrades.erc1967.getImplementationAddress(tables.address);
    console.log("New implementation address:", impl);
    // Create health bot table
    const { chainId } = await account.provider.getNetwork();
    const createStatement = `create table healthbot_${chainId} (counter integer);`;
    let tx = await tables.createTable(account.address, createStatement);
    let receipt = await tx.wait();
    const [, createEvent] = (_a = receipt.events) !== null && _a !== void 0 ? _a : [];
    const tableId = createEvent.args.tableId;
    console.log("Healthbot table created as:", `healthbot_${chainId}_${tableId}`);
    // Insert first row into health bot table
    const runStatement = `insert into healthbot_${chainId}_${tableId} values (1);`;
    tx = await tables.runSQL(account.address, tableId, runStatement);
    receipt = await tx.wait();
    const [runEvent] = (_b = receipt.events) !== null && _b !== void 0 ? _b : [];
    (0, assert_1.default)(runEvent.args.statement === runStatement, "insert statement mismatch");
    console.log("Healthbot table updated with:", (_c = runEvent.args) === null || _c === void 0 ? void 0 : _c.statement);
    // Warn that proxy address needs to be saved in config
    console.warn(`\nSave 'proxies.${hardhat_1.network.name}: "${tables.address}"' in 'proxies.ts'!`);
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
