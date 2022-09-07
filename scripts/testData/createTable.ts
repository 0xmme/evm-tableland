/* eslint-disable object-shorthand */
/* eslint-disable no-unused-vars */
import { ethers, network } from "hardhat";
import { Wallet } from "ethers";
import { connect, Connection } from "@tableland/sdk";
import * as fs from "fs";

async function main() {
  console.log(`\nCreating table on ${network.name}...`);

  const netOpKov = "optimism-kovan";

  const currentTablesFile: string = "constants/deployedTables.json";
  const tablesCreateFile: string = "constants/tableScheme.json";
  const tablesCreate = JSON.parse(fs.readFileSync(tablesCreateFile, "utf8"));
  const tablesToCreateCount = Object.keys(tablesCreate.tablesToCreate).length;
  const provider = new ethers.providers.InfuraProvider(
    network.name,
    process.env.OPTIMISM_KOVAN_API_KEY!
  );

  const account = new Wallet(process.env.ETHEREUM_PRIVATE_KEY!, provider);

  const tableland: Connection = await connect({
    network: "testnet",
    chain: netOpKov,
    signer: account,
  });

  console.log("*************************************************");
  console.log(
    `Connected on ${tableland.options.chain} with ${tableland.options.contract}`
  );

  for (let i = 0; i < tablesToCreateCount; i++) {
    console.log("*************************************************");
    console.log(
      `Trying to create '${tablesCreate.tablesToCreate[i].prefix}' with schema '${tablesCreate.tablesToCreate[i].schema}'`
    );

    const { name, chainId, txnHash } = await tableland.create(
      tablesCreate.tablesToCreate[i].schema, // Table schema definition
      {
        prefix: tablesCreate.tablesToCreate[i].prefix, // Optional `prefix` used to define a human-readable string
      }
    );
    console.log("*************************************************");
    console.log(`Table ${name} on ${network.name} created.`);

    if (txnHash !== null) {
      updateContractAddresses(
        currentTablesFile,
        tablesCreate.tablesToCreate[i].prefix,
        name!,
        tablesCreate.tablesToCreate[i].schema,
        chainId,
        txnHash
      );
    }
  }
}

const updateContractAddresses = (
  currentTablesFile: string,
  prefix: string,
  name: string,
  schema: string,
  chainId: number,
  txnHash: string
) => {
  const currentTables = JSON.parse(fs.readFileSync(currentTablesFile, "utf8"));
  currentTables[chainId].push({
    prefix: prefix,
    name: name,
    chainId: chainId,
    txnHash: txnHash,
    schema: schema,
  });

  fs.writeFileSync(currentTablesFile, JSON.stringify(currentTables));
  console.log("*************************************************");
  console.log(`Table ${name} in JSON File written.`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
