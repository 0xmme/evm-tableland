/* eslint-disable spaced-comment */
/* eslint-disable object-shorthand */
/* eslint-disable no-unused-vars */
//import connect from "@tableland/sdk";
//import * as fs from "fs";

async function main() {
  // env settings, what table to fetch, which data for selected log below....

  const tableland = require("@tableland/sdk");
  const fs = require("fs");

  const tableDirectoryFile = "constants/deployedTables.json";
  const tableDirectory = JSON.parse(fs.readFileSync(tableDirectoryFile));

  const networkConfig = {
    testnet: "testnet",
    chain: "optimism-goerli",
    chainId: "420",
  };

  const testTableConfig = {
    name: "AdSpace",
  };

  console.log(tableDirectory[networkConfig.chainId]);

  const tableToRead = tableDirectory[networkConfig.chainId].find(
    (elem) => elem.prefix === testTableConfig.name
  ).name;
  console.log(tableToRead);

  //const tableToRead = "AdSpace_69_73";
  const colNumToFiddle = 0;
  const rowNumtoFiddle = 0;

  console.log(`Trying to read table '${tableToRead}' on 'optimism-kovan'`);

  const tablelandConnection = await tableland.connect(networkConfig);

  const { columns, rows } = await tablelandConnection.read(
    `SELECT * FROM ${tableToRead};`
  );

  console.log("----columns-----");
  console.log(columns);
  console.log("----single-col-name----");
  const singleColName = columns[colNumToFiddle].name;
  console.log(singleColName);

  console.log("------rows------");
  console.log(rows);
  console.log("----single-row----");
  const singleRowData = rows[colNumToFiddle];
  console.log(singleRowData);
  console.log("----single-cell----");
  const singleCellData = singleRowData[rowNumtoFiddle];
  console.log(singleCellData);

  console.log("------combined-output------");
  console.log(`${tableToRead} rowno ${rowNumtoFiddle}`);
  console.log(`${singleColName}:${singleCellData}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
