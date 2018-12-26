window.addEventListener('load', async () => {
    decode_p2ms_tx_to_file('28f21faf3ad8dbdf8b18b1bb2dea21af8ba53cc88340c87c0951f81dd93ef692', 'tx_info');
});
function hex2array(hex_str) {
    let a = [];
    for (var i = 0; i < hex_str.length; i += 2) {
        a.push(parseInt("0x" + hex_str.substr(i, 2)));
    }
    return a;
}
function string2array(str) {
    var result = [];
    for (var i = 0; i < str.length; i++) {
        result.push(str.charCodeAt(i));
    }
    return result;
}
function array2string(array) {
    return String.fromCharCode.apply(String, array);
}
function decode_p2ms_tx_to_file(txid, fname) {
    var saveData = (function () {
        var a_tag = document.createElement("a");
        document.body.appendChild(a_tag);
        a_tag.style = "display: none";
        return function (data, fileName) {
            let atmp = new Uint8Array(data);
            let _blob = new Blob([atmp.buffer]);
            let _url = window.URL.createObjectURL(_blob);
            a_tag.href = _url;
            a_tag.download = fileName;
            a_tag.click();
            window.URL.revokeObjectURL(_url);
        };
    }());
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
                let arr = hex2array(result.data.outputs[l - 2].script);
                let str = array2string(arr);
                let meta = str.split('@^_^@');
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
                    let buff = hex2array(result.data.outputs[i].script);//new Buffer.from(result.data.outputs[i].script, 'hex');
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
                if (cnt != file_sz) {
                    console.log('Invalid Info in this Transaction');
                    return;
                } else {
                    let name = fname + ext;
                    console.log('Success to recover data ' + name);
                    //fs.writeFileSync(name, buffdata);
                    let reader = new FileReader();
                    let blob = new Blob(buffdata);
                    saveData(buffdata, name);
                }
            } else {
                console.log('Host failed');
            }
        })
        .catch(console.log);
}
