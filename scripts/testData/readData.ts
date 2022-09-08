/* eslint-disable spaced-comment */
/* eslint-disable object-shorthand */
/* eslint-disable no-unused-vars */
import { connect, Connection } from "@tableland/sdk";

async function main() {
  // env settings, what table to fetch, which data for selected log below....
  const tableToRead = "AdSpace_69_73";
  const colNumToFiddle = 0;
  const rowNumtoFiddle = 0;

  console.log(`Trying to read table '${tableToRead}' on 'optimism-kovan'`);

  const tableland: Connection = await connect({
    network: "testnet",
    chain: "optimism-kovan",
  });

  const adSpaceTable = await tableland.read(`SELECT * FROM ${tableToRead};`);

  console.log("----columns-----");
  console.log(adSpaceTable.columns);
  console.log("----single-col-name----");
  const singleColName = adSpaceTable.columns[colNumToFiddle].name;
  console.log(singleColName);

  console.log("------rows------");
  console.log(adSpaceTable.rows);
  console.log("----single-row----");
  const singleRowData = adSpaceTable.rows[colNumToFiddle];
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
