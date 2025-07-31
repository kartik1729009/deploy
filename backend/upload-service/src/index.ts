import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import { generate } from "./utils";
import { getAllFiles } from "./file";
import path from "path";
import { uploadFile } from "./aws";
import { createClient } from "redis";
const publisher = createClient();
publisher.connect();

const subscriber = createClient();
subscriber.connect();

const app = express();
app.use(cors())
app.use(express.json());

app.post("/deploy", async (req, res) => {
    const repoUrl = req.body.repoUrl;

    if (!repoUrl || typeof repoUrl !== "string") {
        return res.status(400).json({ error: "Invalid or missing 'repoUrl'" });
    }

    const id = generate(); // e.g., "asd12"
    const localPath = path.join(__dirname, `output/${id}`);

    try {
        await simpleGit().clone(repoUrl, localPath);

        const files = getAllFiles(localPath);
        for (const file of files) {
            await uploadFile(file.slice(__dirname.length + 1), file);
        }

        await new Promise((resolve) => setTimeout(resolve, 5000));
        await publisher.lPush("build-queue", id);
        await publisher.hSet("status", id, "uploaded");

        res.json({ id });
    } catch (err) {
        console.error("Clone or upload failed:", err);
        res.status(500).json({ error: "Deployment failed" });
    }
});


app.get("/status", async (req, res) => {
    const id = req.query.id;
    const response = await subscriber.hGet("status", id as string);
    res.json({
        status: response
    })
})

app.listen(3000);

