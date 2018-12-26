const axios = require('axios');
let testnet_url="https://live.blockcypher.com/btc-testnet/pushtx/?t=189e4cc23f37437eb7d90006008c920c"
class BitcoinTxPush{
    constructor(_is_mainet = true) {
        this.is_mainet = _is_mainet;
        this.config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cache-Control': 'no-cache'
            }
        };
    }
    push(signed_tx) {
        let _config = this.config;
        let network = 'btc-testnet';
        let _rawform = `txhex:${signed_tx}&coin_symbol:${network}`;
        axios.post(testnet_url, _rawform, _config)
            .then((result) => {
                console.log(result);
            })
            .catch((err) => {
                console.error(err);
            })        // const requestBody = {
        //     tx_hex: signed_tx,
        //     coin_symbol: 'btc-testnet',
        //   }
    }

}
module.exports=BitcoinTxPush;