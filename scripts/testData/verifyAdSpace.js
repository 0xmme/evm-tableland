/* eslint-disable spaced-comment */
/* eslint-disable object-shorthand */
/* eslint-disable no-unused-vars */
//import { ethers, network } from "hardhat";
//import { Wallet } from "ethers";
//import { ChainName, connect, Connection } from "@tableland/sdk";
//import abi from "./AdSpaceFactory.json";

async function main() {
  const { ethers, network } = require("hardhat");
  const { Wallet } = require("ethers");
  const { ChainName, connect, Connection } = require("@tableland/sdk");

  const abi = require("./AdSpaceFactory.json");

  const networkConfig = {
    testnet: "testnet",
    chain: "optimism-goerli",
    chainId: "420",
  };
  const provider = new ethers.providers.AlchemyProvider(
    network.name,
    process.env.OPTIMISM_GOERLI_API_KEY
  );

  const ABI = abi.abi;
  const ADDRESS = abi.address;

  console.log(`Verifying AdSpace on ${network.name}`);

  const account = new Wallet(
    "0x4c46ef7b1011c8d1fab3470659ecafeda9c3e966fc757b6a6c373c37f577a423",
    provider
  );

  const AdSpaceFactory = new ethers.Contract(ADDRESS, ABI, account);

  console.log(account);
  //const tableland = await connect({
  //  network: "testnet",
  //  chain: networkConfig.chain,
  //  signer: account,
  //});

  //console.log("*************************************************");
  //console.log(
  //  `Connected on ${tableland.options.chain} with ${tableland.options.contract}`
  //);

  const tableToInsert = "AdSpaces_420_100";
  const AdSpaceToUpdate = "1";

  const tx = await AdSpaceFactory.verifyAdSpace(AdSpaceToUpdate);
  console.log(tx);

  //console.log("*************************************************");
  //console.log(`Trying to write data into'${tableToInsert}'`);

  //let sqlStatement = "";
  //sqlStatement = sqlStatement.concat(
  //  "UPDATE ",
  //  tableToInsert,
  //  " SET verified ='1', status = 'Available' WHERE adspace_id = '",
  //  AdSpaceToUpdate,
  //  "';"
  //);

  //const { hash: writeHash } = await tableland.write(sqlStatement);

  //console.log("*************************************************");
  //console.log(`${writeHash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
