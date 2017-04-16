import dotenv from 'dotenv';
import winston from 'winston'
import {Papertrail} from 'winston-papertrail';

dotenv.config();

const {PAPER_HOST, PAPER_PORT} = process.env;


const winstonPapertrail = new winston.transports.Papertrail({
  host: PAPER_HOST,
  port: PAPER_PORT
})

winstonPapertrail.on('error', function(err) {
  // Handle, report, or silently ignore connection errors and failures
});

const logger = new winston.Logger({transports: [winstonPapertrail]});

export default logger;
