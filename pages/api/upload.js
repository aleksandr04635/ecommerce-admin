import multiparty from "multiparty";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from "fs";
import mime from "mime-types";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "@/pages/api/auth/[...nextauth]";
const bucketName = "dawid-next-ecommerce";
import { createRouter, expressWrapper } from "next-connect";
import multer from "multer";

//Uploading to Firebase
import path from "path";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
  uploadString,
  uploadBytes,
} from "firebase/storage";
import { app } from "../../utils/utils.js";

//import DatauriParser from "datauri/parser.js";

const DatauriParser = require("datauri/parser");
const parser = new DatauriParser();
const formatBufferTo64 = (file) =>
  parser.format(path.extname(file.originalname).toString(), file.buffer);
//import cloudinary from "cloudinary";
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true,
});
const ALLOWED_FORMATS = ["image/jpeg", "image/png", "image/jpg", "image/gif"];

const router = createRouter();
/* 
THIS VERSION WORKS AND UPLOADS
router
  // Use express middleware in next-connect with expressWrapper function
  .use(multer().any())
  // A middleware example
  .post(async (req, res) => {
    try {
      //  console.log(`Request :`, req);
      // It's how we use Express middleware in Next
      console.log("req.files:");
      console.log(req.files);
      if (!req.files[0]) {
        throw new Error("Image is not presented!");
      }
      if (req.files[0].size > 500000) {
        throw new Error("File size cannot be larger than 0.5MB!");
      }
      if (!ALLOWED_FORMATS.includes(req.files[0].mimetype)) {
        throw new Error("Not supported file type!");
      }
      //const session = await getSession({ req });
      //console.log("session from file upload:");
      //console.log(session);

      const file64 = formatBufferTo64(req.files[0]);
      //console.log("file64:");
      //console.log(file64.content);
      const uploadResult = await cloudinary.uploader.upload(file64.content, {
        public_id:
          "CloudinaryDemo/" +
          Date.now() +
          "-" +
          Math.round(Math.random() * 1e6),
      });
      console.log("uploadResult:");
      console.log(uploadResult);
      //gets all uploaded resources
      //https://cloudinary.com/documentation/admin_api
      //cloudinary.api.resources()
      //    .then(result=>console.log(result));
      //delete files
      //IT’S BETTER TO DELETE FROM UPLOADER – UNLIMETED USES:
      //cloudinary.v2.uploader.destroy(public_id, options).then(callback);
      return res.status(200).send({ location: uploadResult.url });
    } catch (e) {
      console.log("err:");
      console.log(e);
      return res.status(422).send({ message: e.message });
    }
  });

export const config = {
  api: { bodyParser: false }, //telling next not to parse req
};

export default router.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
}); */

export default async function handle(req, res) {
  await mongooseConnect();
  await isAdminRequest(req, res);

  const form = new multiparty.Form();
  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
  // console.log("length:", files.file.length);
  /*   const client = new S3Client({
    region: 'us-east-1',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  }); */
  const links = [];
  for (const file of files.file) {
    const ext = file.originalFilename.split(".").pop();
    const newFilename = Date.now() + "." + ext;
    console.log("file:", file);
    const cloudinaryUpload = (file, originalname) =>
      cloudinary.uploader.upload(file, {
        public_id:
          "CloudinaryDemo/" +
          Date.now() +
          originalname +
          "-" +
          Math.round(Math.random() * 1e6),
      });
    const uploadResult = await cloudinaryUpload(
      file.path,
      file.originalFilename
    );
    console.log("uploadResult:", uploadResult);
    links.push(uploadResult.url);
    /*     const parser = new DatauriParser();
    const formatBufferTo64 = (file) =>
      parser.format(
        path.extname(file.originalFilename).toString(),
        file.buffer
      );
    const file64 = formatBufferTo64(file);
    console.log(" file64.content: ", file64.content);*/
    //This firebase upload gives a stream
    const storage = getStorage(app);
    //console.log("storage:", storage);
    const fileName = new Date().getTime() + "-" + file.originalFilename;
    const storageRef = ref(storage, fileName);
    /*     const uploadTask = uploadBytesResumable(storageRef, file.path);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.log("error:", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("downloadURL:", downloadURL);
          links.push(downloadURL);
        });
      }
    ); */
    /*     uploadString(storageRef, file64.content, "data_url").then((snapshot) => {
      console.log("Uploaded a 'data_url' string!");
      getDownloadURL(snapshot.ref).then((downloadURL) => {
        console.log("downloadURL: ", downloadURL);
        links.push(downloadURL);
        //return res.status(200).send({ location: downloadURL });
      });
    }); */
    /*     await client.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: newFilename,
      Body: fs.readFileSync(file.path),
      ACL: 'public-read',
      ContentType: mime.lookup(file.path),
    }));
    const link = `https://${bucketName}.s3.amazonaws.com/${newFilename}`;
    links.push(link); */
  }
  return res.json({ links });
}
export const config = {
  api: { bodyParser: false }, //telling next not to parse req
};
