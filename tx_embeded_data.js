//logo btc txid : 7374d7467746cf82490669248dc177cc3a9c6a9496dfbe70ea31c0d77aa95611

/** Library usage
var embed_tx = require('./tx_embeded_data');
var fname ='BC_Logo_.png';
let chunk=embed_tx.file_to_chunks(fname,40);
let buf = embed_tx.buffer_from_chunks(chunk.data,chunk.total_len);
embed_tx.buffer_to_file("o.png",buf);

*/
var fs = require('fs');
function coppy_padding(_from,expected_sz,padding_val){
    let dt=[];
    for (let k = 0; k < expected_sz; k++) {
        if (_from[k]) {
            dt.push(_from[k]);
        } else {
            dt.push(padding_val);
        }
    }
    return dt;
}
function file_to_chunks(fpath, chunk_sz) {
    var chunks = {};
    let encode_opt = 'utf-8';
    let fData = fs.readFileSync(fpath);
    chunks.total_len = fData.length;
    chunks.chunk_sz = chunk_sz;
    chunks.nchunk = Math.ceil(fData.length / chunk_sz);//round up
    chunks.data = [];
    for (let i = 0; i < chunks.nchunk; i++) {
        let end_p = chunk_sz * (i + 1);
        if (end_p > (chunks.total_len)) {
            end_p = chunks.total_len;
        }

        let ch = fData.slice(chunk_sz * i, end_p);
        // //padding zero to the end of data
        // let dt = [];
        // for (let k = 0; k < chunk_sz; k++) {
        //     if (ch[k]) {
        //         dt.push(ch[k]);
        //     } else {
        //         dt.push(0);//padding zero
        //     }
        // }
        //coppy and padding
        let r=coppy_padding(ch,chunk_sz,0);
        chunks.data.push(r);
    }

    chunks.nchunk++;
    let extra = Buffer.from('datasize='+chunks.total_len.toString(),'utf-8');
    let extra_dt=coppy_padding(extra,chunk_sz,0);
    chunks.data.push(extra_dt);
    return chunks;
}
function buffer_from_chunks(chunk_data, total_size) {
    let nchunk = chunk_data.length;
    let buff = [];
    let total = 0;
    for (let i = 0; i < nchunk; i++) {
        let ch = chunk_data[i];
        for (let k = 0; k < ch.length; k++) {
            buff.push(ch[k]);
            total++;
            if (total >= total_size) {
                return new Buffer(buff);
            }
        }
    }
    return new Buffer(buff);
}
function buffer_to_file(fpath, buff) {
    fs.writeFileSync(fpath, buff);
}

module.exports.file_to_chunks = file_to_chunks;
module.exports.buffer_from_chunks = buffer_from_chunks;
module.exports.buffer_to_file = buffer_to_file;