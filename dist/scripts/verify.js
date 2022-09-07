"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
async function main() {
    console.log(`\nVerifying on '${hardhat_1.network.name}'...`);
    // Ensure deployments
    if (hardhat_1.proxy === undefined || hardhat_1.proxy === "") {
        throw Error(`no proxy entry for '${hardhat_1.network.name}'`);
    }
    // Verify implementation
    const tables = (await hardhat_1.ethers.getContractFactory("TablelandTables")).attach(hardhat_1.proxy);
    const impl = await hardhat_1.upgrades.erc1967.getImplementationAddress(tables.address);
    await (0, hardhat_1.run)("verify:verify", {
        address: impl,
    });
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
