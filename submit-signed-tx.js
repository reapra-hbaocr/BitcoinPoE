const axios = require('axios');
const host='https://api.blockcypher.com/v1/btc/test3';
const push_endpoint='/txs/push'; 
const my_token='189e4cc23f37437eb7d90006008c920c';


class BitcoinTxPush{
    constructor(_is_mainet = true) {
        this.is_mainet = _is_mainet;
        this.config = {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        };
    }
    push(signed_tx) {
        let _config = this.config;
        var data={
            token:my_token,
            tx:signed_tx
        }
        
        var testnet_url=host+push_endpoint;

        axios.post(testnet_url,data, _config)
            .then((result) => {
                console.log(result);
            })
            .catch((err) => {
                console.error(err);
            }) 
    }

}
module.exports=BitcoinTxPush;