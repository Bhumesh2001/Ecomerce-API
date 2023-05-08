import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express'

//  create token of user 

const GenerateToken = ((email:string|number)=>{
    return jwt.sign({email},'your-secret-key',{expiresIn:'1h'});
})

// veryfy user
const VerifyToken = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        if(req.headers.cookie){
            const Token:string = req.headers.cookie.split('=')[1]   
            const EmailOrPhone:any = jwt.verify(Token,'your-secret-key')
            req.body.MailOrPhone = EmailOrPhone.email
            next()
        }
        else{
            res.status(401).json({message:'Please Login'})
        }
    } catch (error:any) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Please Login Your Session has expired" });
        }
    }
}

export { GenerateToken, VerifyToken }