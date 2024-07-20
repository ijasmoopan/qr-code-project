import QRCode from 'qrcode';
import Mailer from 'nodemailer';
import PdfDocument from 'pdfkit';
import fs from 'fs';

const createQR = async (req, res) => {
  let toUserEmail = req.params.email;
  let fromUserEmail = process.env.EMAIL_FROM;
  let url = process.env.URL;

  const createPdfFile = async () => {
    console.log('createPdfFile called');

    const pdfFile = new PdfDocument();

    pdfFile.pipe(fs.createWriteStream('ticket-qrcode.pdf'));
    pdfFile.text('Here is your ticket for the event.');
    pdfFile.image('new-qr-code.png', 0, 15, { width: 600 });

    pdfFile.end();
  };

  const sendEmail = async () => {
    let transporter = Mailer.createTransport({
      service: 'gmail',
      auth: {
        user: fromUserEmail,
        pass: process.env.EMAIL_FROM_PASSWORD,
      },
    });

    let mailOptions = {
      from: fromUserEmail,
      to: toUserEmail,
      // to: 'ijasmohamad44@gmail.com',
      // to: 'adarshjr000@gmail.com',
      subject: 'Ticket for the event',
      text: `Hi, here is your ticket for the event. This attached PDF has a QR Code. Scan this when you are entering. Thank you.`,
      attachments: [
        {
          filename: 'ticket-qrcode.pdf',
          path: 'ticket-qrcode.pdf',
          content: 'Here is your QR Code',
        },
      ],
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  };

  const createQRCode = async () => {
    console.log('createQRCode called');
    QRCode.toFile(
      'new-qr-code.png',
      // 'ijasmoopan.github.io/Portfolio',
      `${url}/qr/read/${toUserEmail}`,
      {
        errorCorrectionLevel: 'H',
      },
      async (err) => {
        if (err) throw err;
        console.log('QR code generated!');
        await createPdfFile();
        await sendEmail();
      }
    );
  };

  if (toUserEmail !== '') {
    await createQRCode();
    res.status(200).json({
      response: `Email sent to ${toUserEmail}. Thank you!`,
    });
  } else {
    console.log('Email is empty');
    res.status(500).json({
      response: 'Please add an email in the end of the URL',
    });
  }
};

export default createQR;
