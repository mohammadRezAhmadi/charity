const { expect } = require("chai");
const { ethers } = require("hardhat");
const hre = require("hardhat");


describe("deployment", function () {
  let Charity, charity, ownerSign;
  beforeEach(async function () {
    ownerSign = await ethers.getSigners();
    Charity = await ethers.getContractFactory("Charity");
    charity = await Charity.connect(ownerSign[3]).deploy(1);
    await charity.deployed();
  });
  it("Intro Needay in contract!", async function () {
    //introNeeded
    await charity.connect(ownerSign[3]).IntroNeeded(ownerSign[4].address);
    await charity.connect(ownerSign[3]).IntroNeeded(ownerSign[5].address);
    await charity.connect(ownerSign[3]).IntroNeeded(ownerSign[6].address);
    await charity.cahangeLevelToPending();
    //assist
    await charity.assist(2, { value: hre.ethers.utils.parseEther("0.02") });
    await charity.connect(ownerSign[1]).assist(0, { value: hre.ethers.utils.parseEther("6") });
    // let boole = true;
    expect(await charity.voteStatus(ownerSign[1].address)).to.be.true;
    expect(await charity.voteStatus(ownerSign[2].address)).to.be.false;
    await charity.connect(ownerSign[2]).assist(0, { value: hre.ethers.utils.parseEther("0.5") });
    expect(await charity.voteStatus(ownerSign[2].address)).to.be.true;
    await charity.connect(ownerSign[7]).assist(1, { value: hre.ethers.utils.parseEther("3") });
    console.log(`Charity level: ${await charity.level()}`);
    console.log(`Examination of the needy: ${await charity.needy(0)} +
     ${await charity.needy(1)} + ${await charity.needy(2)}`);
    console.log(` helpers information : ${await charity.helpers(0)} +
      ${await charity.helpers(1)} + ${await charity.helpers(2)} + ${await charity.helpers(3)}`);
    // the payment
    await charity.connect(ownerSign[3]).changeLevelToEnd();
    console.table([`Contract Balance: ${await charity.getBalance()}`]);
    await charity.connect(ownerSign[4]).payEnd(0);
    await charity.connect(ownerSign[5]).payEnd(1);
    await charity.connect(ownerSign[6]).payEnd(2);
    console.table([`contract address: ${charity.address}`]);
    console.table([`Contract Balance: ${await charity.getBalance()}`]);
  });
});