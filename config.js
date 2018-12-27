
const bitcoin = require('bitcoinjs-lib');
module.exports.prvk_wif='cUcTYjjc5hcivJdqjhvg57wSnpsfgaxzTWFtP8cP3J8cYqNPSAQF';
module.exports.get_wallet_info=get_wallet_info;

function get_wallet_info(prk_wif,network){
    let wallet1 = bitcoin.ECPair.fromWIF(prk_wif, network);
    let p2pkh1 = bitcoin.payments.p2pkh({ pubkey: wallet1.publicKey, network: network });
    let p2pkh1_addr = p2pkh1.address;
    let ret={};
    ret.wallet =wallet1;
    ret.p2pkh =p2pkh1;
    ret.p2pkh_addr=p2pkh1_addr;
    return ret;
}



// const p2pkh1 =bitcoin.payments.p2pkh({ pubkey: wallet1.publicKey,network:bitcoin.networks.testnet});
// let p2pkh1_addr=p2pkh1.address;
// let  wallet2 = bitcoin.ECPair.makeRandom({network:TestNet,rng:()=>{
//     return bitcoin.crypto.sha256('satoshi2019');
// }})