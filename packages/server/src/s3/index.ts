import AWS from "aws-sdk";
import { AWS_ACCESS_KEY_ID, AWS_ACCESS_KEY_SECRET } from "../config";

AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_ACCESS_KEY_SECRET,
  signatureVersion: "v4",
  region: "us-east-2",
});

const s3 = new AWS.S3();
export default s3;
