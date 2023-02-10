import dbConnect from "../../../db/dbConnect";
import Staffs from '../../../db/Model/staffSchema';
import formidable from "formidable";
import jwt from "jsonwebtoken";
import { setCookie } from 'cookies-next';
import bcrypt from 'bcryptjs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();
    
    form.parse(req, async function(err, fields, files) {
      if (err) {
        res.status(500).json({ status: 'Error parsing form' });
        return;
      }
      
      try {
        const userExist = await Staffs.findOne({ email: fields.email, status: 'active' }).select('password');
        
        if (userExist) {
          bcrypt.compare(fields.password, userExist.password, (err, passStatus) => {
            if (err) {
              res.status(500).json({ status: 'Error comparing password' });
              return;
            }

            if (passStatus === true) {
              const token = jwt.sign({ email: fields.email }, process.env.JWT_PASS, { expiresIn: 60 * 60 * 24 * 30 * 12 });
              setCookie('adminPass', token, { req, res, maxAge: 60 * 12 * 30, httpOnly: true, secure: true, sameSite: 'strict', path: '/' });
              res.status(200).json({ status: 'success' });
            } else {
              res.status(401).json({ status: 'Invalid Credentials' });
            }
          });
        } else {
          res.status(401).json({ status: 'Invalid Credentials' });
        }
      } catch (err) {
        res.status(500).json({ status: 'Error finding user in the database' });
      }
    });
  } else {
    res.status(405).json({ status: 'Method Not Allowed' });
  }
}
