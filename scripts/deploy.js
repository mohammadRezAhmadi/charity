
const hre = require("hardhat");
const contractName = "Charity";
async function main() {
  const Contract = await hre.ethers.getContractFactory(contractName);
  const contract = await Contract.deploy(12);
  await contract.deployed();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});
