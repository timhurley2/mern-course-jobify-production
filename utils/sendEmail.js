import nodeMailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
const sendVerifyEmail = (toAddress, url) => {
    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASSWORD,
        }
      });
      const mailOptions = {
        from: 'thurle223341@gmail.com',
        to: toAddress,
        subject: 'Subject',
        html: `<p>Thank you for registering for Jobify!!  Please <a href='${url}'>Click Here</a> to confirm your email address`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if(error){
          console.log(error);
        } else{
          console.log('Email sent: ' + info.response);
        }
      });
}

export default sendVerifyEmail;