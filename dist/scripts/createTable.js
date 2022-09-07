"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-unused-vars */
const hardhat_1 = require("hardhat");
const sdk_1 = require("@tableland/sdk");
async function main() {
    console.log(`\nCreating table on '${hardhat_1.network.name}'...`);
    // Get signer
    const [account] = await hardhat_1.ethers.getSigners();
    if (account.provider === undefined) {
        throw Error("missing provider");
    }
    const tableland = await (0, sdk_1.connect)({
        network: "testnet",
        host: "http://127.0.0.1:8545/",
        chain: "local-tableland",
        signer: account,
    });
    console.log("-----------------------");
    console.log(tableland);
    console.log("-----------------------");
    const index = await tableland.list();
    console.log(index);
    // const { name } = await tableland.create(
    //  `id integer, name text, primary key (id)`, // Table schema definition
    //  {
    //    prefix: `my_sdk_table`, // Optional `prefix` used to define a human-readable string
    //  }
    // );
    // console.log("-----------------------");
    // console.log(name);
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
