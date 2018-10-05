import dotenv from 'dotenv';
import {Client } from "pg";
dotenv.config();
const client = new Client({
    connectionString: process.env.DATABASE || 'postgres://Monday:akubudike1!@localhost/fast-food-fast'
  });


export default client;
