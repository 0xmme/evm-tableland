/* eslint-disable spaced-comment */
/* eslint-disable object-shorthand */
/* eslint-disable no-unused-vars */
//import connect from "@tableland/sdk";
//import * as fs from "fs";

async function main() {
  // env settings, what table to fetch, which data for selected log below....

  const tableland = require("@tableland/sdk");

  const networkConfig = {
    name: "localhost",
    chain: "local-tableland",
    host: "http://localhost:8545/",
  };

  const tableToRead = "AdSpaces_31337_0";

  console.log(`Trying to read table '${tableToRead}' on 'localhost'`);

  const tablelandConnection = await tableland.connect(networkConfig);

  console.log(tablelandConnection);

  //const readQueryResult = await tablelandConnection.list();

  const readQueryResult = await tablelandConnection.read(
    `SELECT * FROM ${tableToRead};`
  );

  console.log(readQueryResult);
  //const { columns, rows } = readQueryResult;

  //console.log("----columns-----");
  //console.log(columns);
  //console.log("----single-col-name----");
  //const singleColName = columns[colNumToFiddle].name;
  //console.log(singleColName);

  //console.log("------rows------");
  //console.log(rows);
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
