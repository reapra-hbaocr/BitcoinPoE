
const bitcoin = require('bitcoinjs-lib');
const fs = require('fs');
const TestNet = bitcoin.networks.testnet;
var embed_tx = require('./tx_embeded_data');
var bitcoin_composer = require('./bitcoin_tx_composer');
var bitcoinSubmit= require('./submit-signed-tx');
var mywallet = require('./config');
var bSubmit = new bitcoinSubmit(false);

var fname = 'info.txt';
let chunks = embed_tx.file_to_chunks(fname, 65);

var my_prvK_wif =mywallet.prvk_wif;
var my_acc = mywallet.get_wallet_info(my_prvK_wif,TestNet);
let wallet1 = my_acc.wallet;

let utxo_info = {
    value: 11572044,
    txid: 'f7500116393a275d919b8266b49576835d37bdce4560a9fc5319b2dc178d17ea',
    vout_idx: 8
}

let ret=bitcoin_composer.create_p2ms_tx_info(wallet1,utxo_info,chunks,10,6600,0);
console.log('fee = ',ret.fee);
console.log('TxID:  ',ret.txId);
fs.writeFileSync('o.txt',ret.hexTx);
bSubmit.push(ret.hexTx);