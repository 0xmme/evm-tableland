/* eslint-disable spaced-comment */
/* eslint-disable object-shorthand */
/* eslint-disable no-unused-vars */
import { ethers, network } from "hardhat";
import { Wallet } from "ethers";
import { ChainName, connect, Connection } from "@tableland/sdk";
import { Network } from "@ethersproject/providers";

async function main() {
  //const networkConfig = {
  //  testnet: "testnet",
  //  chain: "optimism-goerli",
  //  chainId: "420",
  //};
  //const provider = new ethers.providers.AlchemyProvider(
  //  network.name,
  //  process.env.OPTIMISM_GOERLI_API_KEY!
  //);

  const networkConfig = {
    testnet: "testnet",
    chain: "ethereum-goerli",
    chainId: "5",
  };
  const provider = new ethers.providers.JsonRpcProvider(
    `https://eth-goerli.alchemyapi.io/v2/${process.env
      .OPTIMISM_GOERLI_API_KEY!}`
  );

  console.log(`Inserting data on ${network.name}`);

  const account = new Wallet(process.env.ETHEREUM_PRIVATE_KEY!, provider);

  const tableland: Connection = await connect({
    network: "testnet",
    chain: networkConfig.chain! as ChainName,
    signer: account,
  });

  console.log("*************************************************");
  console.log(
    `Connected on ${tableland.options.chain} with ${tableland.options.contract}`
  );

  const tableToInsert = "AdSpaces_5_743";

  console.log("*************************************************");
  console.log(`Trying to write data into'${tableToInsert}'`);

  let sqlStatement = "";
  //sqlStatement = sqlStatement.concat(
  //  "INSERT INTO ",
  //  tableToInsert,
  //  " (name,website,verified,status,owner,contract,asking_price,size) VALUES (",
  //  "'BlackPearl2'",
  //  ",",
  //  "'blackpearl2.com'",
  //  ",",
  //  "'0'", //verified
  //  ",",
  //  "'Pending Verification'", // status
  //  ",",
  //  `'${account.address.toString()}'`, // owner
  //  ",",
  //  "'0xd2B4fB3a8e01beFfe215C351e7e07df55C1A293e'", // contract
  //  ",",
  //  "'700'",
  //  ",",
  //  "'wide'",
  //  ");"
  //);

  sqlStatement = sqlStatement.concat(
    "UPDATE ",
    tableToInsert,
    " SET status ='Running Ads' WHERE adspace_id = '",
    "1",
    "';"
  );

  const { hash: writeHash } = await tableland.write(sqlStatement);

  console.log("*************************************************");
  console.log(
    `table ${tableToInsert} sucessfully filled with data row ${sqlStatement} on tx ${writeHash}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
