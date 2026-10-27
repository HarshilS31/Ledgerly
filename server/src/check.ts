import "dotenv/config";
console.log(process.cwd());
console.log(Object.keys(process.env).filter((k) => /GEMINI|JWT|MONGO/.test(k)));