
const bitcoin = require('bitcoinjs-lib');
const fs = require('fs');
const TestNet = bitcoin.networks.testnet;
var embed_tx = require('./tx_embeded_data');
var bitcoin_composer = require('./bitcoin_tx_composer');
var bitcoinSubmit= require('./submit-signed-tx');

var bSubmit = new bitcoinSubmit(false);

var fname = 'BC_Logo_.png';
let chunks = embed_tx.file_to_chunks(fname, 65);

const wallet1 = bitcoin.ECPair.fromWIF('cUcTYjjc5hcivJdqjhvg57wSnpsfgaxzTWFtP8cP3J8cYqNPSAQF', TestNet);
const p2pkh1 = bitcoin.payments.p2pkh({ pubkey: wallet1.publicKey, network: TestNet });
let p2pkh1_addr = p2pkh1.address;
console.log('p2pkh1 ', p2pkh1_addr);

//https://api.blockcypher.com/v1/btc/test3/txs/39bd264bcacc9afd4bcde3492d25a48f69b3ed3ad418920338e3301c74920755?limit=50&includeHex=true
//addr:'mgtRUQJgZEJq2bWjm5Cyncfk8LQKqexmjq',
let utxo_info = {
    value: 11608044,
    txid: '28f21faf3ad8dbdf8b18b1bb2dea21af8ba53cc88340c87c0951f81dd93ef692',
    vout_idx: 21
}
//fb4ae9c3b69ab621ab6b2221b55b6d3f0589f7906f1b02d5232236efdd15449a
let ret=bitcoin_composer.create_p2ms_tx_info(wallet1,utxo_info,chunks,10,7000,1000);
console.log('fee = ',ret.fee);
console.log('TxID:  ',ret.txId);
fs.writeFileSync('o.txt',ret.hexTx);
bSubmit.push(ret.hexTx);