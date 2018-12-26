var embed_tx = require('./tx_embeded_data');
var fname ='info.txt';
let chunk=embed_tx.file_to_chunks(fname,40);

const bitcoin = require('bitcoinjs-lib');
const TestNet = bitcoin.networks.testnet;
const wallet1 = bitcoin.ECPair.fromWIF('cUcTYjjc5hcivJdqjhvg57wSnpsfgaxzTWFtP8cP3J8cYqNPSAQF',TestNet);
const p2pkh1 =bitcoin.payments.p2pkh({ pubkey: wallet1.publicKey,network:TestNet});
let p2pkh1_addr=p2pkh1.address;
console.log('p2pkh1 ',p2pkh1_addr);
//7374d7467746cf82490669248dc177cc3a9c6a9496dfbe70ea31c0d77aa95611
//https://api.blockcypher.com/v1/btc/test3/txs/39bd264bcacc9afd4bcde3492d25a48f69b3ed3ad418920338e3301c74920755?limit=50&includeHex=true
//addr:'mgtRUQJgZEJq2bWjm5Cyncfk8LQKqexmjq',
let utxo_info={
    value:13162715,
    txid:'02e249e87d9b172e921f80b3acdb3e4b2677e21535081f994809b1b2ea79f0aa',
    vout_idx:32
}

const txb = new bitcoin.TransactionBuilder(TestNet);
txb.setVersion(2);

//only true for p2pkh claim
let mining_fee_base=1000;
let fee_rate = 1500;//1100 sat/ kb
let fee = fee_rate*Math.ceil(chunk.total_len/1024) + mining_fee_base;
console.log('fee = ',fee);
txb.addInput(utxo_info.txid,utxo_info.vout_idx);



for(let i=0;i<chunk.nchunk;i++){
    let data = new Buffer(chunk.data[i]);
    let embed = bitcoin.payments.embed({ data: [data] })
    txb.addOutput(embed.output,0);
}

//return change
let sriptpubK = p2pkh1.output;
txb.addOutput(sriptpubK,utxo_info.value-fee);
txb.sign(0,wallet1);
let rawTx =txb.build().toHex();
console.log(rawTx);









//console.log(chunks);

// //https://live.blockcypher.com/btc-testnet/pushtx/?t=None

// //https://live.blockcypher.com/btc-testnet/tx/64f63892d7c4b8a041d0a1d12ebdc0ae2c408463b76d8d88862865f990761f97/

// var x = Buffer.from('abcdef');
// var y = x.slice(2,5);

// console.log(y.toString());


// var BtxHelp= require('./submit-signed-tx');
// var btx= new BtxHelp(false);
// const bitcoin = require('bitcoinjs-lib');
// bs58 = require('bs58');
// const Btc = require('bitcoinjs-lib')
// const TestNet = Btc.networks.testnet;
// const wallet1 = bitcoin.ECPair.fromWIF('cUcTYjjc5hcivJdqjhvg57wSnpsfgaxzTWFtP8cP3J8cYqNPSAQF',TestNet);
// //const addr_testnet_ben32_pk= bitcoin.payments.p2wpkh({ pubkey: wallet1.publicKey ,network:TestNet}).address;
// const p2pkh1 =bitcoin.payments.p2pkh({ pubkey: wallet1.publicKey,network:bitcoin.networks.testnet});
// let p2pkh1_addr=p2pkh1.address;
// console.log('p2pkh1 ',p2pkh1_addr);
// let  wallet2 = bitcoin.ECPair.makeRandom({network:TestNet,rng:()=>{
//     return bitcoin.crypto.sha256('satoshi2019');
// }})
// let p2pkh2=bitcoin.payments.p2pkh({ pubkey: wallet2.publicKey,network:bitcoin.networks.testnet});
// let p2pkh2_addr=p2pkh2.address;
// console.log('p2pkh1 ',p2pkh1_addr);
// console.log('p2pkh2 ',p2pkh2_addr);

// const txb = new bitcoin.TransactionBuilder(TestNet);
// let val=10945500;
// txb.setVersion(2);
// let txid ='0d9cf4699d51ec67b039df98d9cb1b56ff41ba0f89793488fc9e87f83d1a7ab9';
// let vout=1;
// txb.addInput(txid,vout);
// let hash160 = bitcoin.crypto.hash160(wallet2.publicKey);
// let sriptpubK = p2pkh2.output;
// txb.addOutput(sriptpubK,val-1000);
// txb.sign(0,wallet1);
// console.log(txb.network);
// let rawTx =txb.build().toHex();
// console.log(rawTx);
// //btx.push(rawTx);



// // // function rnd()
// // // {
// // //     let phrase='13:53 24/12/2018';
// // //     return bitcoin.crypto.sha256(Buffer(phrase));
// // // }

// // // let keyPair = Btc.ECPair.makeRandom({ network: TestNet,rng:rnd})
// // // let publicKey = keyPair.publicKey.toString('hex');
// // // let { address } = Btc.payments.p2pkh({ pubkey: keyPair.publicKey ,Network:TestNet});

// // // //let publicKey = keyPair.publicKey;
// // // let rawPrK =keyPair.privateKey;
// // // let privateKey = keyPair.toWIF()
// // // console.log(`addr: ${address} \n Private: ${privateKey}`)

// // //this key from 
// // //dumpprivkey 2MxQmjfpybKMzWS8KQW8wa9sRFXWgkVtjUu
// // const prvK='cUcTYjjc5hcivJdqjhvg57wSnpsfgaxzTWFtP8cP3J8cYqNPSAQF';
// // let wallet = new Btc.ECPair.fromWIF(prvK, TestNet);
// // let keyPair =wallet;


// // const p2pk = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: TestNet })
// // //const p2wsh = bitcoin.payments.p2wsh({ redeem: p2pk, network: TestNet })

// // //let publicKey = wallet.getAddress();
// // console.log("my public key:", wallet.publicKey.toString('hex'));
// // let { address } = Btc.payments.p2pkh({ pubkey: wallet.publicKey ,Network:TestNet});
// // console.log(address);

// // console.log('hash160 :' , bitcoin.crypto.hash160(wallet.publicKey).toString('hex'));