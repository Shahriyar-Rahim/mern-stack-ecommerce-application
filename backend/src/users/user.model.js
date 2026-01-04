import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";



const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: String,
  bio: {type: String, maxLength: 200},
  profession: String,
  role: { type: String, default: "user" },
  createdAt: { type: Date, default: Date.now },
});

// hashpassword
userSchema.pre('save', async function () {
    const user = this;
    if (!user.isModified('password')) return;
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
})

// compare password
userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
}

const User = model('User', userSchema);

export default User;