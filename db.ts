import mongoose from 'mongoose';
import validator from 'validator';

mongoose.connect('mongodb://localhost:27017/Ecomerce').then(()=>{
    console.log('Database connected successfully...');
}).catch((err:any)=>{
    console.log(err.message);
})

// created interfaces

interface User {
    Name:string,
    Email:string,
    Password:string,
    PhoneNo:number,
    State:string
}

interface Product {
    Name:string,
    Brand:string,
    Price:number,
    Quantity:number,
    Description:string,
    InStock:boolean,
    Colors:string[],
    AddDate:Date
}

interface Cart {
    UserId:string,
    ProductId:string,
    Quantity:number
}

// mongoose schema 

const UserSchema = new mongoose.Schema<User>({
    Name:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true,
        unique:true,
        validate(value:string){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid !')
            }
        }
    },
    Password:{
        type:String,
        required:true,
        unique:true,
        validate(value:string){
            if(!validator.isStrongPassword(value)){
                throw new Error('Password is invalid !')
            }
        }
    },
    PhoneNo:{
        type:Number,
        required:true,
        unique:true,
        validate:{
            validator:(MoNumber:number)=>{
                return MoNumber.toString().length == 10;
            },
            message:"Mobile Number is incorrect !"
        }
    },
    State:{
        type:String,
        required:true,  
    }
})

const ProductSchema = new mongoose.Schema<Product>({
    Name:{ 
        type:String, 
        required:true 
    },
    Brand:{ 
        type:String, 
        required:true 
    },
    Price:{ 
        type:Number, 
        required:true 
    },
    Quantity:{ 
        type:Number, 
        required:true 
    },
    Description:{ 
        type:String, 
        required:false
    },
    InStock:{ 
        type:Boolean, 
        required:true 
    },
    Colors:{ 
        type:[String], 
        required:false 
    },
    AddDate:{ 
        type:Date, 
        required:true, 
        default:Date.now 
    }
})

const CartSchema = new mongoose.Schema<Cart>({
    UserId:{
        type:String,
        required:true,
        unique:true,
    },
    ProductId:{
        type:String,
        required:true,
        unique:true
    },
    Quantity:{
        type:Number,
        required:true
    }
})

// mongoose model 

const UserModel =  mongoose.model<User>("User",UserSchema);

const ProductModel = mongoose.model<Product>("Product",ProductSchema);

const CartModel = mongoose.model<Cart>('Cart',CartSchema);

export { UserModel, ProductModel, CartModel }