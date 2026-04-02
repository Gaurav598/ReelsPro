import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

/**
 * User Model — MongoDB mein user ka data store karta hai
 *
 * 2 tarah ke users hote hain:
 * 1. Credentials user — email + password se register kiya (password REQUIRED)
 * 2. OAuth user — Google/GitHub se login kiya (password NAHI hota, optional hai)
 *
 * OAuth users ke liye:
 * - name = Google/GitHub profile name
 * - image = profile picture URL
 * - password = undefined (kyunki Google/GitHub handle karta hai authentication)
 */
export interface IUser {
  email: string;
  password?: string; // Optional — OAuth users ke paas password nahi hota
  name?: string; // OAuth profile name
  image?: string; // OAuth profile picture
  _id?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false }, // Not required for OAuth users
    name: { type: String },
    image: { type: String },
  },
  {
    timestamps: true,
  }
);

/**
 * Pre-save hook — save hone se pehle password hash karo
 *
 * bcrypt.hash() plain text password ko encrypted string mein convert karta hai
 * Example: "mypassword" → "$2a$10$xJ8K..." (irreversible — original password nikalna impossible)
 *
 * Sirf tab hash karo jab:
 * 1. Password exist karta ho (OAuth users ka nahi hota)
 * 2. Password modify hua ho (har save pe hash nahi karna, warna double-hash ho jayega)
 */
userSchema.pre("save", async function (next) {
  if (this.password && this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = models?.User || model<IUser>("User", userSchema, "users");

export default User;
