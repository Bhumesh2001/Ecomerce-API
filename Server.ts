import express,{ Request, Response } from 'express'
const app = express();
const PORT:number = 9400;
import{ UserModel, ProductModel, CartModel } from './db'
import { GenerateToken, VerifyToken }  from './auth'

app.use(express.json());

// coustomer registration

app.post('/CreateUser',async(req:Request,res:Response)=>{
    try {
        const NewUser = new UserModel(req.body)
        const UserInfo:object = await NewUser.save()

        console.log(UserInfo);
        res.json({message:'Registration Successful...'})

    } catch (error:any) {
        console.log(error);
        res.json({message:error})
    }
})

// coustomer login

app.get('/LoginUser',async(req:Request,res:Response)=>{
    try {

        // finding the email id or phone no from the db

        let emailOrPhone: string | number = req.body.Email || req.body.PhoneNo;
        var infoOfUser:number|string;
        var UserData;

        if (typeof emailOrPhone === 'string') {
            UserData = await UserModel.find({ Email: emailOrPhone });
            infoOfUser = UserData[0].Email
        }else{
            UserData = await UserModel.find({ PhoneNo: emailOrPhone });
            infoOfUser = UserData[0].PhoneNo
        }

        //  coustomer login process 

        if(req.body.Email === infoOfUser||req.body.PhoneNo === infoOfUser){
            const Token:string = GenerateToken(infoOfUser)
            res.cookie('token',Token)
            console.log('Login Successful...');
            res.json({message:'Login Successful....',LoginUser:UserData})

        }else{
            if(typeof req.body.Email === 'string'){
                console.log('Email is wrong');
                res.json({message:"Email is wrong"})

            }else{
                console.log('Mobile Number is wrong');
                res.json({message:"Mobile Number is wrong"})
            }
        }

    } catch (error:any) {
        console.log('Email or Phone Number is wrong');
        res.json({message:"Email or Phone Number is wrong"})
    }
})

//  Add product into the db

app.post('/Add/Product',async(req:Request,res:Response)=>{
    try {
        const addProduct = new ProductModel(req.body)
        const AddedProduct:object = await addProduct.save()
        console.log(AddedProduct);
        res.json({AddedProduct})
        
    } catch (error:any) {   
        console.log(error);
        res.json({message:error})
    }
})


// All products

app.get('/See/AllProducts',VerifyToken,async(req:Request,res:Response)=>{
    try {
        const AllProducts:object = await ProductModel.find({})
        console.log(AllProducts);                
        res.json({AllProducts})

    } catch (error:any) {
        console.log(error);
        res.json({message:error})
    }
})

// change quantity by user 

app.patch('/Change/quantity',VerifyToken,async(req:Request,res:Response)=>{
    try {
        const UpdatedInfo = await ProductModel.findOneAndUpdate({Name:req.body.Name},{$set:{Quantity:req.body.Quantity}},{new:true})
        console.log(UpdatedInfo);
        res.json({UpdatedInfo})
        
    } catch (error:any) {
        console.log(error);
        res.json({message:error})
    }
})

//  Add cart into the database 

app.post('/Add/Cart',VerifyToken,async(req:Request,res:Response)=>{
    try {
        // get login user id throgh auth file 

        const PhoneOrMail:number|string = req.body.MailOrPhone
        var UserId:any;
        if(typeof PhoneOrMail === 'string'){
            UserId = await UserModel.findOne({Email:PhoneOrMail},{_id:1})
        }else{
            UserId = await UserModel.findOne({PhoneNo:PhoneOrMail},{_id:1})
        }
        //  Cart info save into the cart db.

        const { ProductId, Quantity } = req.body

        const CInfo = new CartModel({ UserId: UserId._id.toString(), ProductId, Quantity })
        const CartInfo = await CInfo.save()
        res.json({CartInfo})

    } catch (error:any) {
        console.log(error);
        res.json({message:error})
    }
})


app.listen(PORT,()=>{
    console.log(`Server Running At http://localhost:${PORT}`);
})