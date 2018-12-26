const bitcoin = require('bitcoinjs-lib');
const fs = require('fs');
const TestNet = bitcoin.networks.testnet;
var embed_tx = require('./tx_embeded_data');
var bitcoin_composer = require('./bitcoin_tx_composer');
var fname = 'BC_Logo_.png';
let chunks = embed_tx.file_to_chunks(fname, 65);

const wallet1 = bitcoin.ECPair.fromWIF('cUcTYjjc5hcivJdqjhvg57wSnpsfgaxzTWFtP8cP3J8cYqNPSAQF', TestNet);
const p2pkh1 = bitcoin.payments.p2pkh({ pubkey: wallet1.publicKey, network: TestNet });
let p2pkh1_addr = p2pkh1.address;
console.log('p2pkh1 ', p2pkh1_addr);

//https://api.blockcypher.com/v1/btc/test3/txs/39bd264bcacc9afd4bcde3492d25a48f69b3ed3ad418920338e3301c74920755?limit=50&includeHex=true
//addr:'mgtRUQJgZEJq2bWjm5Cyncfk8LQKqexmjq',
let utxo_info = {
    value: 13152515,
    txid: '6cb30400bb7726a7d6044f7cb7457de2e35d8db0ea6ae21d12948ba2ba5390da',
    vout_idx: 7
}

let ret=bitcoin_composer.create_p2ms_tx_info(wallet1,utxo_info,chunks,5,6000,1000);
console.log('fee = ',ret.fee);
//console.log(ret.rawTx);
fs.writeFileSync('o.txt',ret.rawTx);


