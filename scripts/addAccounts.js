const Charity = require("../utils/localhostConnector");
const {ethers} = require('hardhat');
async function getBalance(){
    const ownerSign = await ethers.getSigners();
    const charity = await Charity.deploy(12);
    await charity.deployed();

    await charity.IntroNeeded(ownerSign[2].address);
    // console.log(`${await charity.needy(0)}`);
}
getBalance();