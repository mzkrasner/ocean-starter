import { NextApiRequest, NextApiResponse } from "next";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {

    console.log('test')
    console.log(req.body)
    res.status(200).json({ message: 'decrypted' });
  
};
