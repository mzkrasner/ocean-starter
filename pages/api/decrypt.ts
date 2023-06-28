import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import "dotenv/config";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (process.env.KEY) {
    const stringToArray = (bufferString: string) => {
      const uint8Array = new TextEncoder().encode(bufferString);
      return uint8Array;
    };
    const string = process.env.KEY
    const algorithm = "aes-256-cbc";
    const message = req.body;
    console.log(req.body, '15')
    // 16 bytes of data from PK
    const initVector = stringToArray(string.slice(0, 16));
    // 32 bytes of data from PK
    const Securitykey = stringToArray(string.slice(32, 64));
    const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);
    let decrypted = decipher.update(message, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    console.log(decrypted)
    res.status(200).json({ message: decrypted });
  }
};
