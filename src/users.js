import express from 'express';
import client from './config';
// import {Client} from 'pg';

const router = express.Router();

client.connect()
.then(() => console.log('connected'))
.catch(err => console.error('connection error', err.stack));


router.get('/:id/orders',(req,res)=>{
let id;

let idPattern = /[0-9]+/;
if(idPattern.test(req.params.id)){
    id = req.params.id;
}

client.query('SELECT * FROM order_tbl WHERE uid = $1', [id],(error,results)=>{
    if(results.rows[0] === void 0){
        res.json({
            "code":200,
            "failed":"The user has not place any order Yet"
        });
    }
    if (error) {
        res.json({
            "code": 400,
            "failed": 'The order Table was not Generated'
        })
    } else {
        res.json({
            "code": 200,
            "success": `The order related to the id ${id} was fetched`,
            "table": results.rows
        });
    }
});
});

export default router;