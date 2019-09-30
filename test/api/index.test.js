const chai=require('chai');
const chai_http=require('chai-http');
const should=chai.should();
const server=require('../../app'); 

chai.use(chai_http);

describe('Node Server',()=>{
    it('(Get /) returns the home page',(done)=>{
        chai.request(server)
            .get('/')
            .end((err,res)=>{
                res.should.have.status(200);
                done();
            })
    })
})