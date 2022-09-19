/* eslint-disable no-unreachable */
/* eslint-disable spaced-comment */
/* eslint-disable object-shorthand */
/* eslint-disable no-unused-vars */
import { ethers, network } from "hardhat";
import { BigNumber, Wallet } from "ethers";

async function main() {
  console.log(`\nCreating AdSpace on ${network.name}...`);

  const { deployments } = require("hardhat");

  const { abi, address } = require("./AdSpaceFactory.json");

  const networkConfig = {
    testnet: "testnet",
    chain: "optimism-goerli",
    chainId: "420",
  };
  const provider = new ethers.providers.AlchemyProvider(
    network.name,
    process.env.OPTIMISM_GOERLI_API_KEY!
  );

  //const networkConfig = {
  //  testnet: "testnet",
  //  chain: "ethereum-goerli",
  //  chainId: "5",
  //};
  //const provider = new ethers.providers.JsonRpcProvider(
  //  `https://eth-goerli.alchemyapi.io/v2/${process.env
  //    .OPTIMISM_GOERLI_API_KEY!}`
  //);

  const account = new Wallet(process.env.ETHEREUM_PRIVATE_KEY!, provider);
  const AdSpaceFactory = new ethers.Contract(address, abi, account);
  const AdSpaceTable = await AdSpaceFactory.getAdSpaceTable();
  console.log(`AdSpace Tableland table is ${AdSpaceTable}`);

  const tx = await AdSpaceFactory.createAdSpace(
    "test2",
    "test2.2222",
    "0.55",
    5,
    "wide"
  );

  console.log(tx);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
