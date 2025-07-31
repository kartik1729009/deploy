import { S3 } from "aws-sdk";
import fs from "fs";
import path from "path";
const s3 = new S3({
    endpoint:"https://c8d98d6af73eb799b97ceeb28b2a1345.r2.cloudflarestorage.com",  
    accessKeyId: "8903d5edfb4de5441ddbd06e881f4b6d",
    secretAccessKey: "7a3f659fe37091c0d511f746324547417388d19514c5e5befa44cc7cf53410f2",
});


export const uploadFile = async(fileName: string, localFilePath:string)=>{
    console.log("called");
    const fileContent = fs.readFileSync(localFilePath); 

  const response = await s3
    .upload({
      Bucket: "vercel", 
      Key: fileName,
      Body: fileContent,
    })
    .promise();
    console.log(response);
}