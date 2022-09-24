/* eslint-disable spaced-comment */
/* eslint-disable object-shorthand */
/* eslint-disable no-unused-vars */
//import connect from "@tableland/sdk";
//import * as fs from "fs";

async function main() {
  // env settings, what table to fetch, which data for selected log below....

  const tableland = require("@tableland/sdk");
  //const fs = require("fs");

  //const tableDirectory = JSON.parse(
  //  fs.readFileSync("constants/deployedTables.json")
  //);

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

  const tableToRead = "AdSpaces_420_111";
  const tableToRead2 = "Campaigns_420_112";
  const tableToRead3 = "Deals_420_113";

  //const colNumToFiddle = 0;
  //const rowNumtoFiddle = 0;

  console.log(
    `Trying to read table '${tableToRead2}' on '${networkConfig.chain}'`
  );

  const tablelandConnection = await tableland.connect(networkConfig);

  const readQueryResult = await tablelandConnection.read(
    `SELECT * FROM ${tableToRead2};`

    //`SELECT ${tableToRead}.name as AdSpaceName, ${tableToRead3}.price,${tableToRead3}.started_at, ${tableToRead3}.end_at,${tableToRead2}.name as CampaignName, ${tableToRead2}.cid FROM ${tableToRead} INNER JOIN ${tableToRead3}  INNER JOIN ${tableToRead2} WHERE adspace_id = adspace_id_fk AND campaign_id = campaign_id_fk;`
  );

  const { columns, rows } = readQueryResult;

  console.log("----columns-----");
  console.log(columns);
  ////console.log("----single-col-name----");
  ////const singleColName = columns[colNumToFiddle].name;
  ////console.log(singleColName);

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
  ////console.log(columnsFixed);
  //console.log(rowsFixed[0].verified);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
