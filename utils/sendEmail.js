import nodeMailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
const sendEmail = () => {
    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASSWORD,
        }
      });
      const mailOptions = {
        from: 'thurle223341@gmail.com',
        to: 'thurle223341@gmail.com',
        subject: 'Subject',
        text: 'Testing 123'
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if(error){
          console.log(error);
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error})
        } else{
          console.log('Email sent: ' + info.response);
          res.status(StatusCodes.OK).json({msg: 'Successfully sent email'});
        }
    
      });
}