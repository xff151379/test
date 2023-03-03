const { expect } = require("chai");

describe("MingAirdrop", function () {
    let owner;
    let userAddr;
    let mingToken;
    let merkleRoot;
    let merkleProof;
    let contractInstance;

    beforeEach(async function () {

        const MingToken = await ethers.getContractFactory("Ming");
        mingToken = await MingToken.deploy();


        owner = await ethers.getSigner(0);
        merkleRoot = "0xeeefd63003e0e702cb41cd0043015a6e26ddb38073cc6ffeb0ba3e808ba8c097";
        merkleProof = [
            "0x999bf57501565dbd2fdcea36efa2b9aef8340a8901e3459f4a4c926275d36cdb",
            "0x4726e4102af77216b09ccd94f40daa10531c87c4d60bba7f3b3faf5ff9f19b3c",
        ];
        userAddr = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4";
        const MingAirdrop = await ethers.getContractFactory("MingAirdrop");
        contractInstance = await MingAirdrop.deploy(mingToken.address, merkleRoot);
        await mingToken.transfer(contractInstance.address, ethers.utils.parseEther("10000")); // 合约发送 Ming 代币用于空投
    });

    it("should allow user to claim tokens", async function () {

        expect(await contractInstance.claimed(userAddr)).to.be.false;


        await contractInstance.claim(merkleProof, userAddr);

        expect(await contractInstance.claimed(userAddr)).to.be.true;

        expect(await mingToken.balanceOf(userAddr)).to.equal(ethers.utils.parseEther("1"));
    });
});