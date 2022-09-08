/* eslint-disable object-shorthand */
/* eslint-disable no-unused-vars */
import { ethers, network } from "hardhat";
import { BigNumber, Wallet } from "ethers";
import { connect, Connection } from "@tableland/sdk";
import * as fs from "fs";

async function main() {
  console.log(`\nCreating table on ${network.name}...`);

  const netOpKov = "optimism-kovan";
  // const netOpGoe = "optimism-goerli";

  const currentTablesFile: string = "constants/deployedTables.json";
  const tablesCreateFile: string = "constants/tableScheme.json";
  const tablesCreate = JSON.parse(fs.readFileSync(tablesCreateFile, "utf8"));
  const tablesToCreateCount = Object.keys(tablesCreate.tablesToCreate).length;
  const provider = new ethers.providers.InfuraProvider(
    network.name,
    process.env.OPTIMISM_KOVAN_API_KEY!
  );
  // const provider = new ethers.providers.AlchemyProvider(
  //  network.name,
  //  process.env.OPTIMISM_GOERLI_API_KEY!
  // );

  const account = new Wallet(process.env.ETHEREUM_PRIVATE_KEY!, provider);

  const tableland: Connection = await connect({
    network: "testnet",
    chain: netOpKov,
    signer: account,
  });

  //  ${name} (${tablesCreate.tablesToCreate[i].schema_short}) VALUES (${tablesCreate.tablesToCreate[i].data[j]});`

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

    console.log("*************************************************");
    console.log(`Trying to write data into'${name}'`);

    const dataRowsToCreate = tablesCreate.tablesToCreate[i].data.length;
    const dataColumnsToCreate = tablesCreate.tablesToCreate[i].fieldCount;

    let sqlStatement = "";

    for (let row = 0; row < dataRowsToCreate; row++) {
      // Building SQL Statement for Tableland
      sqlStatement = sqlStatement
        .concat(`INSERT INTO `)
        .concat(`${name!}`)
        // .concat(name!)
        .concat(` (${tablesCreate.tablesToCreate[i].schema_short}) `)
        .concat(`VALUES (`);
      for (let column = 0; column < dataColumnsToCreate; column++) {
        if (
          typeof tablesCreate.tablesToCreate[i].data[row][column] === "string"
        ) {
          sqlStatement = sqlStatement.concat(
            `'${tablesCreate.tablesToCreate[i].data[row][column]}'`
          );
        } else {
          sqlStatement = sqlStatement.concat(
            `${tablesCreate.tablesToCreate[i].data[row][column]}`
          );
        }
        if (column < dataColumnsToCreate - 1) {
          sqlStatement = sqlStatement.concat(`,`);
        }
      }
      sqlStatement = sqlStatement.concat(`);`);

      const { hash: writeHash } = await tableland.write(sqlStatement);

      console.log("*************************************************");
      console.log(
        `table ${name} sucessfully filled with data row ${sqlStatement} on tx ${writeHash}`
      );
      sqlStatement = "";
    }

    if (txnHash !== null) {
      updateContractAddresses(
        currentTablesFile,
        tablesCreate.tablesToCreate[i].prefix,
        name!,
        tablesCreate.tablesToCreate[i].schema,
        chainId,
        txnHash,
        tablesCreate.tablesToCreate[i].data
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
  txnHash: string,
  data: any[]
) => {
  const currentTables = JSON.parse(fs.readFileSync(currentTablesFile, "utf8"));
  currentTables[chainId].push({
    prefix: prefix,
    name: name,
    chainId: chainId,
    txnHash: txnHash,
    schema: schema,
    data: data,
  });

  fs.writeFileSync(currentTablesFile, JSON.stringify(currentTables));
  console.log("*************************************************");
  console.log(`Table ${name} in JSON File written.`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
