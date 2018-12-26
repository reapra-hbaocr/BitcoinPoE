const bitcoin = require('bitcoinjs-lib');
function create_op_return_tx_info(wallet, utxo_info, data_chunks,fee_rate=3000,fee_base=1000,network=bitcoin.networks.testnet) {
    let len=data_chunks.data[0].length;
    if(len>40){
        console.error('data chunk as op_ret must be equal or less than 40')
        return '';
    }
    let fee = fee_rate * Math.ceil(data_chunks.total_len / 1024) + fee_base;
    console.log('fee = ', fee);
    if((utxo_info.value - fee) <=0){
        console.error('Utxo not enough to pay the fee');
        return '';
    }
    const p2pkh = bitcoin.payments.p2pkh({ pubkey: wallet.publicKey, network: network });
    let p2pkh_addr = p2pkh.address;
    console.log("from p2pkh addres ", p2pkh_addr);

    const txb = new bitcoin.TransactionBuilder(network);
    txb.setVersion(2);
    //this input only valid (can be signed by default)only true for p2pkh claim
    txb.addInput(utxo_info.txid, utxo_info.vout_idx);
    for (let i = 0; i < data_chunks.nchunk; i++) {
        let data = new Buffer(data_chunks.data[i]);
        let embed = bitcoin.payments.embed({ data: [data] })
        txb.addOutput(embed.output, 0);
    }
    //return change
    let sriptpubK = p2pkh.output;
    txb.addOutput(sriptpubK, utxo_info.value - fee);
    txb.sign(0, wallet);
    let rawTx = txb.build().toHex();
    // console.log(rawTx);
    // return rawTx;
    let ret={};
    ret.fee = fee;
    ret.rawTx=rawTx;
    return ret;
}
function create_p2ms_tx_info(wallet, utxo_info, data_chunks,n_numner=3,fee_rate=3000,fee_base=100,network=bitcoin.networks.testnet){
    let len=data_chunks.data[0].length;
    if((len!=65)&&(tmp!=33)){
        console.error('data chunk as pubkey must have length 65 or 33')
        return '';
    }
    //n_numner = 3;//m of n multisig
    let fee = fee_rate * Math.ceil(data_chunks.total_len / 1024) + fee_base;
    console.log('fee = ', fee);

    if((utxo_info.value - fee) <=0){
        console.error('Utxo not enough to pay the fee');
        return '';
    }

    if((n_numner>15)||(n_numner<2)){
        console.error('Limited Multisig from 2 to 15');
        return '';
    }

    const p2pkh = bitcoin.payments.p2pkh({ pubkey: wallet.publicKey, network: network });
    let p2pkh_addr = p2pkh.address;
    console.log("from p2pkh addres ", p2pkh_addr);

    const txb = new bitcoin.TransactionBuilder(network);
    txb.setVersion(2);

    //this input only valid (can be signed by default)only true for p2pkh claim
    txb.addInput(utxo_info.txid, utxo_info.vout_idx);
    let nchunk =data_chunks.nchunk;
   
    let n_out = Math.ceil(nchunk / n_numner);//round up

    const keyPairs = [
        bitcoin.ECPair.makeRandom({ network: network }),
        bitcoin.ECPair.makeRandom({ network: network }),
        bitcoin.ECPair.makeRandom({ network: network }),
        bitcoin.ECPair.makeRandom({ network: network })
      ]
      var pubkeys = keyPairs.map(x => x.publicKey)
      const pk2ms = bitcoin.payments.p2ms({ m: 1,pubkeys: pubkeys,network: network })

    for (let i = 0; i < n_out; i++) {
        let end_p = n_numner * (i + 1);
        if (end_p > (n_out)) {
            end_p = data_chunks.total_len;
        }
        let ch = data_chunks.data.slice(n_numner * i, end_p);
        
        if(ch){
            //let p2ms = bitcoin.payments.p2ms({network:network,m:1,pubkeys:ch});
            //const dat = ch.map(pk => new Uint8Array(pk));
            //const p2ms = bitcoin.payments.p2ms({ m: 1,pubkeys: dat,network: network })
            let fake_P2MS=[];
            fake_P2MS.push(bitcoin.opcodes.OP_1);
            for(let i=0;i<ch.length;i++){
                let dat= ch[i];
                fake_P2MS.push(dat.length);
                for(let k=0;k<dat.length;k++){
                    fake_P2MS.push(dat[k]); 
                }
            }
            fake_P2MS.push(bitcoin.opcodes.OP_1+ch.length-1);
            fake_P2MS.push(bitcoin.opcodes.OP_CHECKMULTISIG);
            fake_P2MS = new Buffer(fake_P2MS);
           // let fake_scriptPubK=fake_P2MS.toString('hex');
           // console.log('fake_scriptPubK : ',fake_scriptPubK);
            txb.addOutput(fake_P2MS, 1);
        }
       
    }
    //return change
    let sriptpubK = p2pkh.output;
    txb.addOutput(sriptpubK, utxo_info.value - fee);
    txb.sign(0, wallet);
    let rawTx = txb.build().toHex();
    //console.log(rawTx);
    let ret={};
    ret.fee = fee;
    ret.rawTx=rawTx;
    return ret;
}
module.exports.create_op_return_tx_info=create_op_return_tx_info;
module.exports.create_p2ms_tx_info=create_p2ms_tx_info;