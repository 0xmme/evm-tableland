/* eslint-disable no-unused-vars */
import { ethers, network } from "hardhat";
import { connect } from "@tableland/sdk";
import fetch, { Headers, Request, Response } from "cross-fetch";

if (!globalThis.fetch) {
  globalThis.fetch = fetch;
  globalThis.Headers = Headers;
  globalThis.Request = Request;
  globalThis.Response = Response;
}

async function main() {
  console.log(`\nCreating table on '${network.name}'...`);

  // Get signer
  const [account] = await ethers.getSigners();
  if (account.provider === undefined) {
    throw Error("missing provider");
  }

  const tableland = await connect({
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
