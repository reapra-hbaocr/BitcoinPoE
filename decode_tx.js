const axios = require('axios');
var fs = require('fs');
function decode_p2ms_tx_to_file(txid, fname) {
    const url = "https://api.blockcypher.com/v1/btc/test3/txs/" + txid + "?limit=5000&includeHex=false";
    axios.get(url)
        .then((result) => {
            console.log('status ', result.status);
            let buffdata = [];
            let cnt = 0;
            if (result.status == 200) {
                let l = result.data.outputs.length;
                if (l < 3) {
                    console.log('Invalid Transaction');
                    return;
                }
                let meta = new Buffer.from(result.data.outputs[l - 2].script, 'hex').toString('utf-8').split('@^_^@');
                let file_sz = parseInt(meta[1].replace('size=', ''));
                let ext = meta[2];//.replace('*.ext=','');

                if (ext.indexOf('*.ext=') >= 0) {
                    ext = meta[2].replace('*.ext=', '');
                } else {
                    ext = '';
                }

                if (file_sz == 0) {
                    console.log('Invalid Transaction');
                    return;
                }
                for (let i = 0; i < l - 1; i++) { //last tx return bitcoin to sender
                    let buff = new Buffer.from(result.data.outputs[i].script, 'hex');
                    let ndata = buff[buff.length - 2] - 0x50;//OP_#
                    let sz = buff[1];//OP_PUSHDATA(65)
                    let start = 2;
                    for (let p = 0; p < ndata; p++) {

                        let end = start + sz;
                        let chk = buff.slice(start, end);
                        for (let x = 0; x < chk.length; x++) {
                            if (cnt < file_sz) {
                                buffdata.push(chk[x]);
                                cnt++;
                            }
                        }
                        start = end + 1;//next chunk, jum over to pushdata opcode
                    }
                }
                buffdata = new Buffer(buffdata);


                if (cnt != file_sz) {
                    console.log('Invalid Info in this Transaction');
                    return;
                } else {
                    let name_ =fname + ext;
                    console.log('Success to recover data ' + name_);
                    fs.writeFileSync(name_, buffdata);
                }
            } else {
                console.log('Host failed');
            }
        })
        .catch(console.log)
}
decode_p2ms_tx_to_file('28f21faf3ad8dbdf8b18b1bb2dea21af8ba53cc88340c87c0951f81dd93ef692', 'txlogo1234');