import dotenv from "dotenv"
import { existsSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const currentFile = fileURLToPath(import.meta.url)
const currentDir = path.dirname(currentFile)

const envPath = [
    path.resolve(currentDir, "../../.env"),
    path.resolve(currentDir, "../../../.env")
].find(existsSync)

if (!envPath) {
    throw new Error("Unable to find the server .env file")
}

const result = dotenv.config({ path: envPath })

if (result.error) {
    throw result.error
}