import nodemailer from "nodemailer";
import EventEmitter from "events";
export const subjects={
    confirmEmail:"confirmEmail",
    resetPassword:"resetPassword",
    resetEmail:"resetEmail",
}
Object.freeze(subjects);
export const sendEmail = async({to , subject ,text ,html})=>{
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  service: "gmail",
  port: 465,
  secure: true, // true for port 465, false for other ports
  auth: {
    user:process.env.EMAIL, // generated ethereal user,
    pass: process.env.PASSWORD, // generated ethereal password",
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: process.env.EMAIL, 
    to, 
    subject, 
    text, 
    html,
  });

}

main().catch(console.error);

}

export const emailEvent = new EventEmitter();
emailEvent.on('confirmEmail',async({to , subject = subjects.confirmEmail , text , html})=>{
await sendEmail({to , subject , text , html})
})

emailEvent.on('resetPassword',async({to , subject = subjects.resetPassword , text , html})=>{
  await sendEmail({to , subject , text , html})
  })
  emailEvent.on('resetEmail',async({to , subject = subjects.resetEmail , text , html})=>{
    await sendEmail({to , subject , text , html})
    })