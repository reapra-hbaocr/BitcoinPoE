const axios = require('axios');
var fs= require('fs');
function decode_p2ms_tx_to_file(txid,fname){
   let config = {
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
        }
    };
    const url="https://api.blockcypher.com/v1/btc/test3/txs/"+txid+"?limit=5000&includeHex=false";
    axios.get(url)
    .then((result)=>{
        console.log('status ',result.status);
        let buffdata=[];
        let cnt=0;
        if(result.status==200){
            let l=result.data.outputs.length;
            if(l<3){
                console.log('Invalid Transaction');
                return;
            }
            let meta =new Buffer.from(result.data.outputs[l-2].script,'hex').toString('utf-8').split('@^_^@');
            let file_sz =parseInt(meta[1].replace('size=',''));
            if(file_sz==0){
                console.log('Invalid Transaction');
                return;
            }
            for(let i=0;i<l-1;i++){ //last tx return bitcoin to sender
                let buff =new Buffer.from(result.data.outputs[i].script,'hex');
                let ndata=buff[buff.length-2]-0x50;//OP_#
                let sz= buff[1];//OP_PUSHDATA(65)
                let start=2;
                for(let p=0;p<ndata;p++){
                   
                    let end =start+sz;
                    let chk=buff.slice(start,end);
                    for(let x=0;x<chk.length;x++){
                        if(cnt<file_sz){
                            buffdata.push(chk[x]);
                            cnt++;
                        }
                    }
                    start=end+1;//next chunk, jum over to pushdata opcode
                }
            }
            buffdata= new Buffer(buffdata);
            // let aa = fs.readFileSync('BC_Logo_.png');
            // for(let j=0;j<cnt;j++){
               
            //     if(aa[j] != buffdata[j]){
            //         dif =aa[j] -buffdata[j]
            //         console.log('diff at '+ j+ '  '+ dif);
            //     }
            // }

            if(cnt !=file_sz){
                console.log('Invalid Info in this Transaction');
                return;
            }else{
                console.log('Success to recover data '+ fname);
                fs.writeFileSync(fname,buffdata);
            }
        }else{
          
        }
    })
    .catch(console.log)
}
decode_p2ms_tx_to_file('fb4ae9c3b69ab621ab6b2221b55b6d3f0589f7906f1b02d5232236efdd15449a','txlogo.png');