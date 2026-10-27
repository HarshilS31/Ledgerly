import type { userPayload } from "./interfaces.js";

declare module "express-serve-static-core" {
    interface Request {
        user?: userPayload;
    }
}
