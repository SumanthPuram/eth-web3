if (process.argv.length < 4) {
  console.log('Usage: node <script> <node_id> <contract_address>');
  process.exit(-1);
}

const nodeId = process.argv[2];
const contractAddress = process.argv[3];
const fs = require('fs');
const Web3 = require('web3');

const web3 = new Web3(Web3.givenProvider || `http://localhost:854${nodeId}`);

// const web3Copy = new Web3(Web3.givenProvider || "http://localhost:8542");

const inputAbi = fs.readFileSync('./src/contracts/outputs/sampleContract_sol_SampleContract.abi');
const inputBin = fs.readFileSync('./src/contracts/outputs/sampleContract_sol_SampleContract.bin');
const inputAbiJson = JSON.parse(inputAbi);

async function readNode(web = web3) {
  const address = await web.eth.getCoinbase();
  const sampleContract = new web.eth.Contract(inputAbiJson, contractAddress);

  const value = await sampleContract.methods.getValue().call({ from: address});
  console.log(`value: ${JSON.stringify(value)}`);
}

async function verifyContract() {
  readNode();
}

try {
  verifyContract();
} catch (err) {
}
