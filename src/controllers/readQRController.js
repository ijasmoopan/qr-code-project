import Jimp from 'jimp';
import fs from 'fs';
import qrCodeReader from 'qrcode-reader';

const readQR = (req, res) => {
  const buffer = fs.readFileSync('new-qr-code.png');
  let userEmail = '';

  Jimp.read(buffer, (err, image) => {
    if (err) {
      console.error(err);
    }

    const qrCodeInstance = new qrCodeReader();

    qrCodeInstance.callback = (err, value) => {
      if (err) {
        console.error(err);
      }
      let resultValues = value.result.split('/');
      userEmail = resultValues[resultValues.length - 1];
      console.log({ userEmail });
    };

    qrCodeInstance.decode(image.bitmap);
  });
  res.status(200).json({
    response: `User added to the list`,
  });
};

export default readQR;
