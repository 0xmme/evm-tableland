/* eslint-disable no-unreachable */
/* eslint-disable spaced-comment */
/* eslint-disable object-shorthand */
/* eslint-disable no-unused-vars */
import { ethers, network } from "hardhat";
import { Wallet } from "ethers";

async function main() {
  console.log(`\nCreating Deal on ${network.name}...`);

  const { abi, address } = require("./AdSpaceFactory.json");

  //const networkConfig = {
  //  testnet: "testnet",
  //  chain: "optimism-goerli",
  //  chainId: "420",
  //};
  const provider = new ethers.providers.AlchemyProvider(
    network.name,
    process.env.OPTIMISM_GOERLI_API_KEY!
  );

  const account = new Wallet(process.env.ETHEREUM_PRIVATE_KEY!, provider);
  const AdSpaceFactory = new ethers.Contract(address, abi, account);
  const AdSpaceTable = await AdSpaceFactory.getAdSpaceTable();
  const CampaignTable = await AdSpaceFactory.getCampaignTable();
  const DealTable = await AdSpaceFactory.getDealTable();
  console.log(`AdSpace Tableland table is ${AdSpaceTable}`);
  console.log(`Campaigns Tableland table is ${CampaignTable}`);
  console.log(`Deals Tableland table is ${DealTable}`);

  const blockNo = await ethers.provider.getBlockNumber();
  const { timestamp } = await ethers.provider.getBlock(blockNo);
  const tx = await AdSpaceFactory.createDeal(1, 42, timestamp, 1);

  console.log(tx);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
