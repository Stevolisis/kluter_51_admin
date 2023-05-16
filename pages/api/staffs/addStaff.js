import Staffs from "../../../db/Model/staffSchema";
import dbConnect from "../../../db/dbConnect";
import formidable from "formidable";
import bcrypt from 'bcryptjs';
import Cloudinary from '../../../serviceFunctions/cloudinary';
import { verifyTokenPriveledge } from "../../../serviceFunctions/verifyToken";

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  await dbConnect();
  const validImageTypes = ['jpg', 'JPG', 'png', 'PNG', 'jpeg', 'JPEG', 'gif', 'GIF', 'webp', 'WEBP'];
  if (req.method === 'POST') {
    const verify = await verifyTokenPriveledge(req.cookies.adminPass, 'addStaffs');
    if (req.cookies.adminPass !== undefined && verify === true) {
      const form = new formidable.IncomingForm();
      form.parse(req, async function(err, fields, files) {
        if (err) return err;
        if (files.img_link.size === 0) return res.status(200).json({ status: 'No Img Link Why Bro?' });
        if (!validImageTypes.includes(files.img_link.mimetype.split('/')[1], 0)) return res.status(200).json({ status: 'Invalid Image Type' });
        if (files.img_link.size >= 1048576) return res.status(200).json({ status: 'Image Size must be less than 1mb' });
        if (files.full_name === 'admin') return res.status(200).json({ status: 'This name is not Permitted' });
        try {
          const password = await bcrypt.hash(fields.password, 10);
          let date=new Date();
          const AdminCheck = await Staffs.findOne({ admin: true }).select('full_name email position admin');
          const EmailCheck = await Staffs.findOne({ email: fields.email }).select('full_name email position admin');
          if (AdminCheck && AdminCheck.admin && (fields.full_name === 'Admin' || fields.full_name === 'admin')) {
            return res.status(200).json({ status: 'Duplicate of admin is not Permitted' });
          }
          if (EmailCheck) {
            return res.status(200).json({ status: 'Account with this email already exist' });
          }
          const cloudImg = await Cloudinary.uploader.upload(files.img_link.filepath);
          const staff = new Staffs({
            full_name: fields.full_name,
            email: fields.email,
            position: fields.position,
            description: fields.description,
            priveldges: JSON.parse(fields.priveldges),
            password: password,
            whatsapp: JSON.parse(fields.whatsapp),
            dribble: JSON.parse(fields.dribble),
            github: JSON.parse(fields.github),
            linkedin: JSON.parse(fields.linkedin),
            twitter: JSON.parse(fields.twitter),
            instagram: JSON.parse(fields.instagram),
            img: { public_id: cloudImg.public_id, url: cloudImg.secure_url },
            status: fields.status,
            admin: fields.full_name === 'Admin' ? true : false || fields.full_name === 'admin' ? true : false,
            day: date.getDay(),
            month: date.getMonth(),
            year: date.getFullYear()
          });
          await staff.save();
          res.status(200).json({ status: 'success' });
        } catch (err) {
          res.status(404).json({ status: err.message });
        }
      });
    } else if (verify === 'not Permitted') {
      res.status(200).json({ status: 'not Permitted' });
    } else {
      res.status(200).json({status:'Invalid User'})
    }

  }else{
      res.status(404).json({status:'error'})
  }


}