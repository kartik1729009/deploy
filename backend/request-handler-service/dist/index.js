"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const aws_sdk_1 = require("aws-sdk");
const s3 = new aws_sdk_1.S3({
    endpoint: "https://c8d98d6af73eb799b97ceeb28b2a1345.r2.cloudflarestorage.com",
    accessKeyId: "8903d5edfb4de5441ddbd06e881f4b6d",
    secretAccessKey: "7a3f659fe37091c0d511f746324547417388d19514c5e5befa44cc7cf53410f2",
});
const app = (0, express_1.default)();
app.get("/*", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const host = req.hostname; // e.g., 4g6db.100xdevs.com or 4g6db.localhost
        const id = host.split(".")[0]; // "4g6db"
        let filePath = req.path;
        if (filePath === "/")
            filePath = "/index.html";
        const key = `dist/${id}${filePath}`;
        console.log(`[${new Date().toISOString()}] Fetching from S3: ${key}`);
        const object = yield s3.getObject({
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
    }
    catch (err) {
        console.error("❌ S3 Fetch Error:", err.message);
        res.status(404).send("File not found.");
    }
}));
app.listen(3001, () => {
    console.log("✅ Server running at http://localhost:3001 or http://<id>.localhost:3001");
});
