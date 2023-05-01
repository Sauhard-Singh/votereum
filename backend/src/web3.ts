import Web3 from "web3";
import data from "../build/contracts/Election.json";

// declare global {
//     interface Window {
//       ethereum?: any;
//     }
//   }
  
// private key= 237eb5cec12c8b9a3943b422aacba29b51f0fff4bbbd9d1e436261f6b1729352
  



// export const web3 = new Web3("http://localhost:7545");
export const web3 = new Web3("https://sepolia.infura.io/v3/152bbc2e3dd94a2bba3084425e695d14");
// export const web3 = new Web3("https://eth-sepolia.g.alchemy.com/v2/y7lBJ-KOtkZi2TpCdZq7qUYQ0eyCVFoF");



// const provider = new Web3.providers.HttpProvider("http://localhost:7545");
const provider = new Web3.providers.HttpProvider("https://sepolia.infura.io/v3/152bbc2e3dd94a2bba3084425e695d14");
// const provider = new Web3.providers.HttpProvider("https://eth-sepolia.g.alchemy.com/v2/y7lBJ-KOtkZi2TpCdZq7qUYQ0eyCVFoF");


// export const web3 = new Web3(provider);


const contract = require("@truffle/contract");

const ElectionContract = contract(data);

ElectionContract.setProvider(provider);

export default ElectionContract;
