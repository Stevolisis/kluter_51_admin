import dbConnect from "../../../db/dbConnect";
import jwt from "jsonwebtoken";
import { baseUrl } from "@/components/BaseUrl";

export const config = {
    api: {
      bodyParser: false,
    },
}
  
export default async function handler(req, res) {
  await dbConnect();
  
  if (req.method === 'GET') {
    const { cookie } = req.query;

    try {
        // const rest = await fetch(`${baseUrl}/api/authentication/adminAuth?cookie=${cookie}`);
        // console.log(rest)

      jwt.verify(cookie, process.env.JWT_PASS);
      res.status(200).json({ status: 'valid' });
    } catch (err) {
      res.status(404).json({ status: err.message });
    }
  } else {
    res.status(500).json({ status: 'Error not GET' });
  }
}
