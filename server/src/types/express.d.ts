interface userPayload {    
    id:string
}
declare global {
    namespace express {
        interface Request {
            user: userPayload;
        }
    }

}