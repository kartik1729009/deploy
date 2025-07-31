import express from "express";
import { S3 } from "aws-sdk";
const s3 = new S3({
    endpoint:"https://c8d98d6af73eb799b97ceeb28b2a1345.r2.cloudflarestorage.com",  
    accessKeyId: "8903d5edfb4de5441ddbd06e881f4b6d",
    secretAccessKey: "7a3f659fe37091c0d511f746324547417388d19514c5e5befa44cc7cf53410f2",
});


const app = express();

app.get("/*", async (req, res) => {
  try {
    const host = req.hostname; // e.g., 4g6db.100xdevs.com or 4g6db.localhost
    const id = host.split(".")[0]; // "4g6db"

    let filePath = req.path;
    if (filePath === "/") filePath = "/index.html";

    const key = `dist/${id}${filePath}`;
    console.log(`[${new Date().toISOString()}] Fetching from S3: ${key}`);

    const object = await s3.getObject({
      Bucket: "vercel",
      Key: key
    }).promise();

    const contentType = filePath.endsWith(".html") ? "text/html"
                  : filePath.endsWith(".css") ? "text/css"
                  : filePath.endsWith(".js") ? "application/javascript"
                  : filePath.endsWith(".json") ? "application/json"
                  : filePath.endsWith(".png") ? "image/png"
                  : filePath.endsWith(".jpg") ? "image/jpeg"
                  : filePath.endsWith(".svg") ? "image/svg+xml" // <-- add this
                  : "application/octet-stream";


    res.status(200).type(contentType).send(object.Body);
  } catch (err: any) {
    console.error("❌ S3 Fetch Error:", err.message);
    res.status(404).send("File not found.");
  }
});

app.listen(3001, () => {
  console.log("✅ Server running at http://localhost:3001 or http://<id>.localhost:3001");
});
