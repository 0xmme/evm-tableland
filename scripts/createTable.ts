/* eslint-disable no-unused-vars */
import { ethers, network } from "hardhat";
import { Wallet } from "ethers";
import { connect } from "@tableland/sdk";

async function main() {
  console.log(`\nCreating table on '${network.name}'...`);

  const provider = new ethers.providers.AlchemyProvider(
    "optimism-goerli",
    process.env.OPTIMISM_GOERLI_API_KEY!
  );

  const account = new Wallet(process.env.ETHEREUM_PRIVATE_KEY!, provider);

  const tableland = await connect({
    network: "testnet",
    chain: "optimism-goerli",
    signer: account,
  });
  console.log("-----------------------");
  console.log(tableland);

  console.log("-----------------------");
  let index = await tableland.list();
  console.log(index);

  const { name, chainId, txnHash } = await tableland.create(
    `id integer, name text, primary key (id)`, // Table schema definition
    {
      prefix: `my_third_sdk_table`, // Optional `prefix` used to define a human-readable string
    }
  );

  console.log("-----------------------");
  console.log(name);

  index = await tableland.list();
  console.log(index);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
