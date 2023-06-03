const {ethers} = require('hardhat');
const abi = require('../artifacts/contracts/Charity.sol/Charity.json').abi;
const address = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const provider = new ethers.providers.JsonRpcProvider();
// console.log(provider);
const contract = new ethers.Contract(address,abi,provider);
console.log(contract);
module.export = contract;