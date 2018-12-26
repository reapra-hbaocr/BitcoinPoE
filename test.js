// var bitcore = require('bitcore-lib');
// let testnet=bitcore.Networks.testnet;
// console.log(testnet);


//https://live.blockcypher.com/btc-testnet/pushtx/?t=None

//https://live.blockcypher.com/btc-testnet/tx/64f63892d7c4b8a041d0a1d12ebdc0ae2c408463b76d8d88862865f990761f97/

var BtxHelp= require('./submit-signed-tx');
var btx= new BtxHelp(false);
const bitcoin = require('bitcoinjs-lib');
bs58 = require('bs58');
const Btc = require('bitcoinjs-lib')
const TestNet = Btc.networks.testnet;
const wallet1 = bitcoin.ECPair.fromWIF('cUcTYjjc5hcivJdqjhvg57wSnpsfgaxzTWFtP8cP3J8cYqNPSAQF',TestNet);
//const addr_testnet_ben32_pk= bitcoin.payments.p2wpkh({ pubkey: wallet1.publicKey ,network:TestNet}).address;
const p2pkh1 =bitcoin.payments.p2pkh({ pubkey: wallet1.publicKey,network:bitcoin.networks.testnet});
let p2pkh1_addr=p2pkh1.address;

let  wallet2 = bitcoin.ECPair.makeRandom({network:TestNet,rng:()=>{
    return bitcoin.crypto.sha256('satoshi2019');
}})

let p2pkh2=bitcoin.payments.p2pkh({ pubkey: wallet2.publicKey,network:bitcoin.networks.testnet});
let p2pkh2_addr=p2pkh2.address;
console.log('p2pkh1 ',p2pkh1_addr);
console.log('p2pkh2 ',p2pkh2_addr);

const txb = new bitcoin.TransactionBuilder(TestNet);
let val=19030231;
txb.setVersion(2);
let txid ='5297beeffa33588c7cf13c283fe92e662dfd95da9e78ad1cec66c3249f7641be';
let vout=1;
txb.addInput(txid,vout);
let hash160 = bitcoin.crypto.hash160(wallet2.publicKey);
let sriptpubK = p2pkh2.output;
txb.addOutput(sriptpubK,val-1000);
txb.sign(0,wallet1);
console.log(txb.network);
let rawTx =txb.build().toHex();
console.log(rawTx);
//btx.push(rawTx);



// // function rnd()
// // {
// //     let phrase='13:53 24/12/2018';
// //     return bitcoin.crypto.sha256(Buffer(phrase));
// // }

// // let keyPair = Btc.ECPair.makeRandom({ network: TestNet,rng:rnd})
// // let publicKey = keyPair.publicKey.toString('hex');
// // let { address } = Btc.payments.p2pkh({ pubkey: keyPair.publicKey ,Network:TestNet});

// // //let publicKey = keyPair.publicKey;
// // let rawPrK =keyPair.privateKey;
// // let privateKey = keyPair.toWIF()
// // console.log(`addr: ${address} \n Private: ${privateKey}`)

// //this key from 
// //dumpprivkey 2MxQmjfpybKMzWS8KQW8wa9sRFXWgkVtjUu
// const prvK='cUcTYjjc5hcivJdqjhvg57wSnpsfgaxzTWFtP8cP3J8cYqNPSAQF';
// let wallet = new Btc.ECPair.fromWIF(prvK, TestNet);
// let keyPair =wallet;


// const p2pk = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: TestNet })
// //const p2wsh = bitcoin.payments.p2wsh({ redeem: p2pk, network: TestNet })

// //let publicKey = wallet.getAddress();
// console.log("my public key:", wallet.publicKey.toString('hex'));
// let { address } = Btc.payments.p2pkh({ pubkey: wallet.publicKey ,Network:TestNet});
// console.log(address);

// console.log('hash160 :' , bitcoin.crypto.hash160(wallet.publicKey).toString('hex'));