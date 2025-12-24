import { createRequestHandler } from "@react-router/node";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function handler(req, res) {
    try {
        const build = await import(join(__dirname, "../build/server/index.js"));
        const requestHandler = createRequestHandler({ build });
        return requestHandler(req, res);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
}
