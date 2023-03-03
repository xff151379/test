const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");


describe("Ming", function () {


    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();

        ming = await ethers.getContractFactory("Ming");
        token = await ming.deploy();
        await token.deployed();
    });

    describe("Deployment", function () {
        it("Should set the right name and symbol", async function () {
            expect(await token.name()).to.equal("Ming");
            expect(await token.symbol()).to.equal("MING");
        });

        it("Should assign the total supply of tokens to the owner", async function () {
            const ownerBalance = await token.balanceOf(owner.address);
            expect(await token.totalSupply()).to.equal(ownerBalance);
        });
    });

    describe("Transactions", function () {
        it("Should transfer tokens between accounts", async function () {
            // Transfer 50 tokens from owner to addr1
            await token.transfer(addr1.address, 50);
            const addr1Balance = await token.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(50);

            // Transfer 50 tokens from addr1 to addr2
            await token.connect(addr1).transfer(addr2.address, 50);
            const addr2Balance = await token.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(50);
        });

        it("Should fail if sender doesn't have enough tokens", async function () {
            const initialOwnerBalance = await token.balanceOf(owner.address);

            // Try to transfer 1 token from addr1 (0 tokens) to owner (1000000 tokens).
            // `require` will evaluate false and revert the transaction.
            await expect(
                token.connect(addr1).transfer(owner.address, 1)
            ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

            // Owner balance shouldn't have changed.
            expect(await token.balanceOf(owner.address)).to.equal(initialOwnerBalance);
        });

        it("Should update balances after transfers", async function () {
            const initialOwnerBalance = await token.balanceOf(owner.address);

            // Transfer 100 tokens from owner to addr1.
            await token.transfer(addr1.address, 100);

            // Transfer another 50 tokens from owner to addr2.
            await token.transfer(addr2.address, 50);

            // Check balances.
            const finalOwnerBalance = await token.balanceOf(owner.address);
            expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));

            const addr1Balance = await token.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(100);

            const addr2Balance = await token.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(50);
        });
    });
});
