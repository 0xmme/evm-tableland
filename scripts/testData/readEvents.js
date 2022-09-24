/* eslint-disable spaced-comment */
/* eslint-disable object-shorthand */
/* eslint-disable no-unused-vars */
//import connect from "@tableland/sdk";
//import * as fs from "fs";

const ethers = require("ethers");

async function main() {
  // env settings, what table to fetch, which data for selected log below....

  const provider = new ethers.providers.JsonRpcProvider(
    "https://flashy-omniscient-slug.optimism-goerli.discover.quiknode.pro/7a2fdffa24bf4fd891bd9c77fdaa6325b0041dbb/"
  );

  const filter = {
    address: "0x4d8572306a9cf3aee41A1d2024E2aeC632C4caDE",
  };

  //utils . parseBytes32String (
  const filterId = await provider.send("eth_newFilter", [filter]);
  console.log(filterId);

  const params = [filterId];
  const result = await provider.send("eth_getFilterLogs", params);
  console.log(result);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
