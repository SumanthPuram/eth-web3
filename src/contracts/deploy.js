if (process.argv.length < 3) {
  console.log('Usage: node <script> <node_id>');
  process.exit(-1);
}
const nodeId = process.argv[2];
const PASSWORD = "ethereumlocal";
const fs = require('fs');
const Web3 = require('web3');

const web3 = new Web3(Web3.givenProvider || `http://localhost:854${nodeId}`);
// const web3Copy = new Web3(Web3.givenProvider || "http://localhost:8542");

const inputAbi = fs.readFileSync('./src/contracts/outputs/sampleContract_sol_SampleContract.abi');
const inputBin = fs.readFileSync('./src/contracts/outputs/sampleContract_sol_SampleContract.bin');

let contractAddress = null;

async function readNode(web = web3) {
  const address = await web.eth.getCoinbase();
  const inputAbiJson = JSON.parse(inputAbi);
  const sampleContract = new web.eth.Contract(inputAbiJson, contractAddress);

  const value = await sampleContract.methods.getValue().call({ from: address});
  console.log(`value: ${JSON.stringify(value)}`);
}

async function updateNode(val, web = web3) {
  const address = await web.eth.getCoinbase();
  const inputAbiJson = JSON.parse(inputAbi);
  const sampleContract = new web.eth.Contract(inputAbiJson, contractAddress);

  const value = await sampleContract.methods.setValue(val).send({ from: address});
}

async function deploy() {
  const address = await web3.eth.getCoinbase();
  const inputAbiJson = JSON.parse(inputAbi);
  const sampleContract = new web3.eth.Contract(inputAbiJson);
  await web3.eth.personal.unlockAccount(address, PASSWORD);

  console.log(`inputAbiJson: ${inputAbiJson}`);

  const deployOpts = {
    data: "0x" + inputBin
  };

  const sendOpts = {
    from: address,
    gas: 1500000,
    gasPrice: '30000000000000'
  };

  const deployResponse = await sampleContract.deploy(deployOpts);

  deployResponse.send(sendOpts)
    .on('error', function(error){
      console.log(`error: ${error}`);
    })
    .on('transactionHash', function(transactionHash){
      console.log(`transactionHash: ${transactionHash}`);
    })
    .on('receipt', function(receipt){
      console.log(`receipt.contractAddress: ${receipt.contractAddress}`);
      console.log(receipt.contractAddress) // contains the new contract address
    })
    .on('confirmation', function(confirmationNumber, receipt){
      console.log(`confirmationNumber: ${confirmationNumber}`);
    })
  .then(async function(newContractInstance){
    // instance with the new contract address
    console.log('\x1b[36m%s\x1b[0m', `New contract address: ${newContractInstance.options.address}`);
    contractAddress = newContractInstance.options.address;
    await readNode();
    await updateNode(10);
    await readNode();
  });
}

try {
  deploy();
} catch (err) {
}
