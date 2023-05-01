import { Request, Response } from "express";
import ElectionContract, { web3 } from "../../web3";
import memoryCache from "memory-cache";

export default async (_: Request, res: Response) => {
  const privateKey = "e75c27da7804f00da1063ee1ba15e4c70f3a2be0828b46f0648360c6ed35c95f";
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  // unlock the account to enable transaction signing
  web3.eth.accounts.wallet.add(account);
  console.log("address:", account.address);
  // const accounts = await web3.eth.getAccounts();
  const instance = await ElectionContract.deployed();

  const status = await instance.getStatus();
  console.log("status:",status)

  if (status !== "running") return res.status(400).send("election not started");

  console.log("Ending Election")
  const gasPrice = await web3.eth.getGasPrice();
  const gasLimit = 300000; // or whatever gas limit you need
  const nonce = await web3.eth.getTransactionCount(account.address);

  const endElectionAbi = web3.eth.abi.encodeFunctionCall({
    name: 'endElection',
    type: 'function',
    inputs: []
  }, []);

  const txData = endElectionAbi;
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

  console.log("Election Ended");

  const votes = await instance.getVotes();

  memoryCache.clear();

  return res.send({ votes });
};
