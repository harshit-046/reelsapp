import mongoose, { model, models, Schema } from "mongoose";
import brcrypt from "bcrypt";

export interface IUser {
    email : string;
    password : string;
    _id? : mongoose.Types.ObjectId;
    createdAt? : Date;
    updatedAt? : Date;
}
const userSchema = new Schema<IUser> (
    {
        email: {type: String, required : true, unique : true},
        password : {type: String, required: true,},
    },
    {timestamps : true}
);

userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await brcrypt.hash(this.password,10)
    }
    next();  
})

const User = models?.User || model("User",userSchema);

export default User;