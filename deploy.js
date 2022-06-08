const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();
//

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const abi = fs.readFileSync("./simpleStorage_sol_SimpleStorage.abi", "utf-8");
  const bin = fs.readFileSync("./simpleStorage_sol_SimpleStorage.bin", "utf-8");
  // Deploy contract with bin, abi, wallet
  const factory = new ethers.ContractFactory(abi, bin, wallet);
  //   Deployed contract method that uses the await function
  contract = await factory.deploy();
  //   try to get the receipt of the transaction, the .wait() get it after 1 block
  await contract.deployTransaction.wait(1);
  // try to get out functions in the SimpleStorage contract
  const FavouriteNumber = await contract.retrieve();
  console.log(`Favourite Number: ${FavouriteNumber.toString()}`);
  let transactionResponse = await contract.store(14);
  let storeReceipt = await transactionResponse.wait(1);
  const UpFavouriteNumber = await contract.retrieve();
  console.log(`Updated Number: ${UpFavouriteNumber.toString()}`);
  // const addPersonFunction = await contract.addPerson();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
