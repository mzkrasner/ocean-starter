import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import "dotenv/config";
import {hash, compare} from 'bcryptjs';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (process.env.KEY) {
    const stringToArray = (bufferString: string) => {
      const uint8Array = new TextEncoder().encode(bufferString);
      return uint8Array;
    };
    const string = process.env.KEY;
    const algorithm = "aes-256-cbc";
    const message = req.body;
    // 16 bytes of data from PK
    const initVector = stringToArray(string.slice(0, 16));
    // 32 bytes of data from PK
    const Securitykey = stringToArray(string.slice(32, 64));
    const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
    let encryptedData = cipher.update(message, "utf8", "hex");
    encryptedData += cipher.final("hex");
    console.log(encryptedData)
    res.status(200).json({ message: encryptedData });
  }
};

//generate random bytes for initVector and save with corresponding message
//use during decryption process (will be consistent)

//use a random private key (not ceramic seed) for securityKey
