import { execSync } from "child_process";
import fs from "fs";

let envContent = fs.readFileSync(".env.local", "utf8");
let dbUrl = "";
const match = envContent.match(/DATABASE_URL=([^\n]+)/);
if (match) {
    dbUrl = match[1].replace(/"/g, "").trim();
}

console.log("Found DB URL (masked):", dbUrl.substring(0, 30) + "...");
process.env.DATABASE_URL = dbUrl;

try {
    execSync("npx prisma db push", { stdio: "inherit", env: process.env });
    console.log("Success!");
} catch (e) {
    console.error("Failed to push:", e);
}
