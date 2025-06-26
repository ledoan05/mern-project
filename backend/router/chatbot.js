import { chat } from "../controller/chatbot.js";
import express from 'express';

const route = express.Router();

route.post('/', chat);

export default route