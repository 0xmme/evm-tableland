/* eslint-disable spaced-comment */
/* eslint-disable object-shorthand */
/* eslint-disable no-unused-vars */
//import connect from "@tableland/sdk";
//import * as fs from "fs";

async function main() {
  // env settings, what table to fetch, which data for selected log below....

  const tableland = require("@tableland/sdk");
  const fs = require("fs");

  const tableDirectory = JSON.parse(
    fs.readFileSync("constants/deployedTables.json")
  );

  const networkConfig = {
    testnet: "testnet",
    chain: "optimism-goerli",
    chainId: "420",
  };

  //const networkConfig = {
  //  testnet: "testnet",
  //  chain: "ethereum-goerli",
  //  chainId: "5",
  //};

  const tableToRead = "AdSpaces_420_100";

  const colNumToFiddle = 0;
  const rowNumtoFiddle = 0;

  console.log(
    `Trying to read table '${tableToRead}' on '${networkConfig.chain}'`
  );

  const tablelandConnection = await tableland.connect(networkConfig);

  const readQueryResult = await tablelandConnection.read(
    //`SELECT count(campaign_id) as countID FROM ${tableToRead};`

    `SELECT * FROM ${tableToRead};`
  );

  const { columns, rows } = readQueryResult;

  console.log("----columns-----");
  console.log(columns);
  //console.log("----single-col-name----");
  //const singleColName = columns[colNumToFiddle].name;
  //console.log(singleColName);

  console.log("------rows------");
  console.log(rows);
  //console.log("----single-row----");
  //const singleRowData = rows[colNumToFiddle];
  //console.log(singleRowData);
  //console.log("----single-cell----");
  //const singleCellData = singleRowData[rowNumtoFiddle];
  //console.log(singleCellData);

  //console.log("------combined-output------");
  //console.log(`${tableToRead} rowno ${rowNumtoFiddle}`);
  //console.log(`${singleColName}:${singleCellData}`);

  //console.log("------array-output------");
  //const columnsFixed = columns.map((elem) => {
  //  return { name: elem.name, accessor: elem.name };
  //});

  //const rowsFixed = tableland.resultsToObjects(readQueryResult);
  //console.log(columnsFixed);
  //console.log(rowsFixed);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
