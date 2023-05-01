import { Request, Response } from "express";
import * as yup from "yup";
import ElectionContract, { web3 } from "../../web3";

const schema = yup.object({
  body: yup.object({
    name: yup.string().min(3).required(),
    description: yup.string().min(3).required(),
    candidates: yup.array(
      yup.object({
        name: yup.string().min(3),
        info: yup.string().min(3),
      })
    ),
  }),
});

export default async (req: Request, res: Response) => {
  try {
    await schema.validate(req);
  } catch (error: any) {
    return res.status(400).send(error.errors);
  }

  const privateKey = "e75c27da7804f00da1063ee1ba15e4c70f3a2be0828b46f0648360c6ed35c95f";
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  // unlock the account to enable transaction signing
  web3.eth.accounts.wallet.add(account);
  console.log("address:", account.address);

  const instance = await ElectionContract.deployed();

  const status = await instance.getStatus();
  console.log("status:",status)
  if (status !== "not-started")
    return res.status(400).send("election already started or not reset");

  const nonce = await web3.eth.getTransactionCount(account.address);
  console.log("nonce:",nonce)


  const gasPrice = await web3.eth.getGasPrice();
  console.log("gasPrice:",gasPrice)

  const gasLimit = 3000000;

  // const txData = instance.setElectionDetails(req.body.name, req.body.description,  {
  //   from: account.address,}).encodeABI();

  const setElectionDetailsAbi = web3.eth.abi.encodeFunctionCall({
    name: 'setElectionDetails',
    type: 'function',
    inputs: [{
      type: 'string',
      name: 'name'
    }, {
      type: 'string',
      name: 'description'
    }]
  }, [req.body.name, req.body.description]);
  
  const txData = setElectionDetailsAbi;
    console.log("txData:",txData)

  const tx = {
    from: account.address,
    to: instance.address,
    nonce: nonce,
    gasPrice: gasPrice,
    gasLimit: gasLimit,
    data: txData,
  };

  const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
  if (!signedTx.rawTransaction) {
    return res.status(400).send('Transaction signing failed');
  }
  console.log("Starting Election")


  await web3.eth.sendSignedTransaction(signedTx.rawTransaction);


  for (let i = 0; i < req.body.candidates.length; i++) {
    const candidate = req.body.candidates[i];

    // const candidateTxData = instance.addCandidate(candidate.name, candidate.info, {
    //   from: account.address,}).encodeABI();

    const addCandidateAbi = web3.eth.abi.encodeFunctionCall({
      name: 'addCandidate',
      type: 'function',
      inputs: [{
        type: 'string',
        name: 'name'
      }, {
        type: 'string',
        name: 'info'
      }]
    }, [candidate.name, candidate.info]);
    
    const candidateTxData = addCandidateAbi;
    

    const candidateTx = {
      from: account.address,
      to: instance.address,
      nonce: nonce + i + 1, // increment the nonce for each transaction
      gasPrice: gasPrice,
      gasLimit: gasLimit,
      data: candidateTxData,
    };

    const signedCandidateTx = await web3.eth.accounts.signTransaction(candidateTx, privateKey);
    if (!signedCandidateTx.rawTransaction) {
      return res.status(400).send('Transaction signing failed');
    }
    await web3.eth.sendSignedTransaction(signedCandidateTx.rawTransaction);
  }
  console.log("Election Started")


  return res.send(req.body);
};
