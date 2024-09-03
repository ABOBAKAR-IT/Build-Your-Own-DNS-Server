const dgram = require('node:dgram')
const server =dgram.createSocket('udp4')
const dnsPacket= require('dns-packet')

const DNS_DB={
    'abobakar.com':{
        type:'A',
        data:'192.168.1.1'
    },
    'google.com':{
        type:'A',
        data:'216.58.194.174'
    },
    'facebook.com':{
        type:'A',
        data:'157.240.1.35'
    },
    'youtube.com':{
        type:'CNAME',
        data:'abobakar.site'
    },
    
}

server.on('message',(msg,reqInfo)=>{
    const incomingReq=dnsPacket.decode(msg)
    console.log(incomingReq.questions[0].name)
    const ipFromDB=DNS_DB[incomingReq.questions[0].name]
console.log(ipFromDB)
    const ans=dnsPacket.encode({
        type:'response',
        id:incomingReq.id,
        flags:incomingReq.AUTHORITATIVE_ANSWER,
        questions:incomingReq.questions,
        answer:[{
            type:'A',
            class:'IN',
            name:incomingReq.questions[0].name,
            data:ipFromDB
        }]
    })
//console.log(incomingReq)

server.send(ans,reqInfo.port,reqInfo.address)

})


server.bind(5312,()=>console.log('DNS server running on port 5312'))