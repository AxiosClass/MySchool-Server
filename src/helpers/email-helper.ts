import NodeMailer from 'nodemailer';
import { EMAIL, PASSWORD } from '../app/config';

export const transporter = NodeMailer.createTransport({ service: 'gmail', auth: { user: EMAIL, pass: PASSWORD } });
export const generateMailOption = (revicerEmail: string) => ({ form: EMAIL, to: revicerEmail });

// Email Templates
export const generatePasswordEmailTemplate = (password: string) => {
  return `
    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet" />
      <style>
        *,
        html,
        body {
          font-family: "Poppins", sans-serif;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          color: #333;
        }
      </style>
      <title>Document</title>
    </head>
    <body>
      <main>
        <section style="border-bottom: 2px solid #1111; border-top: 12px solid #006a4e; padding: 24px; border-radius: 4px;">
          <h1 style="font-size: 32px;">My School</h1>
          <p style="margin-top: 12px;">Here's your password ${password}</p>
          <p style="font-size: 14px; margin-top: 4px;">Do not share this password with any other</p>
        </section>
      </main>
    </body>
    </html>
  `;
};
