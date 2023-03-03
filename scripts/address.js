const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const { ethers } = require("ethers");
const readline = require('readline');


const addresses = [];
for (let i = 0; i < 1000000; i++) {
    const wallet = ethers.Wallet.createRandom();
    addresses.push(wallet.address);
    console.log(addresses[i]);

}

const leafNodes = addresses.map(addr => keccak256(addr));

const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });

const rootHash = merkleTree.getRoot();

console.log('Whitelist Merkle Tree\n', merkleTree.toString());

console.log("Root Hash: ", rootHash.toString('hex'));

let claimingAddress;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter a value: ', (value) => {
    claimingAddress = keccak256(value);
    console.log(`Hash of ${value}: ${claimingAddress.toString('hex')}`);

    const hexProof = merkleTree.getHexProof(claimingAddress);
    console.log(hexProof);
    console.log(merkleTree.verify(hexProof, claimingAddress, rootHash));
    rl.close();
});
