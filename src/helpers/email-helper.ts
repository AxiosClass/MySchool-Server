import NodeMailer from 'nodemailer';
import { EMAIL, PASSWORD } from '../app/config';

export const transporter = NodeMailer.createTransport({ service: "gmail", auth: { user: EMAIL, pass: PASSWORD } })
export const generateMailOption = (revicerEmail: string) => ({ form: EMAIL, to: revicerEmail })

// Email Templates
