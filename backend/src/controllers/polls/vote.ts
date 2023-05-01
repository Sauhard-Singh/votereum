import { Request, Response } from "express";
import ElectionContract, { web3 } from "../../web3";
// import memoryCache from "memory-cache";
import * as yup from "yup";

const checkSchema = yup.object({
  body: yup.object({
    id: yup.string().required(),
  }),
});

export const checkVoteability = async (req: Request, res: Response) => {
  try {
    await checkSchema.validate(req);
  } catch (error) {
    return res.status(400).send({ error });
  }

  const instance = await ElectionContract.deployed();
  const voters: Array<any> = await instance.getVoters();
  const status: "not-started" | "running" | "finished" =
    await instance.getStatus();

  if (status !== "running") return res.status(400).send("election not running");
  if (voters.includes(req.body.id)) return res.send("already-voted");

  return res.send("not-voted");
};

const schema = yup.object({
  body: yup.object({
    id: yup.string().required(),
    name: yup.string().min(3).required(),
    candidate: yup.string().min(3).required(),
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
  // const accounts = await web3.eth.getAccounts();
  const instance = await ElectionContract.deployed();
  const voters: Array<any> = await instance.getVoters();
  const candidates: Array<any> = await instance.getCandidates();

  if (voters.includes(req.body.id))
    return res.status(400).send("already voted");

  if (!candidates.includes(req.body.candidate))
    return res.status(400).send("no such candidate");

  // await instance.vote(req.body.id, req.body.name, req.body.candidate, {
  //   from: accounts[0],
  // });

  console.log("Voting")
  const gasPrice = await web3.eth.getGasPrice();
  const gasLimit = 300000; // or whatever gas limit you need
  const nonce = await web3.eth.getTransactionCount(account.address);

  const voteElectionAbi = web3.eth.abi.encodeFunctionCall({
    name: 'vote',
    type: 'function',
    inputs: [{
      type: 'string',
      name: 'id'
    }, {
      type: 'string',
      name: 'name'
    },{
      type: 'string',
      name: 'candidate'
    }]
  }, [req.body.id, req.body.name,req.body.candidate]);

  const txData = voteElectionAbi;
    console.log("txData:",txData)

  const txParams = {
    from: account.address,
    to: instance.address,
    gasPrice: gasPrice,
    gas: gasLimit,
    nonce: nonce,
    data: txData
  };

  const signedTx = await web3.eth.accounts.signTransaction(txParams, privateKey);

  if (signedTx.rawTransaction === undefined) {
    throw new Error("Failed to sign transaction");
  }

  const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  console.log("Transaction Hash:", txReceipt.transactionHash);

  console.log("Vote Successful");

  return res.send("successful");
};
