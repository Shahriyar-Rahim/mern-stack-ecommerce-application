import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useLoginUserMutation } from "../redux/features/auth/authApi";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/features/auth/authSlice";
import { toast } from "react-toastify";

const Login = () => {
  const [message, setMessage] = useState("");
  const { register, handleSubmit, formState: { errors },} = useForm();

  const [loginUser, {isLoading, error }] = useLoginUserMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    // console.log(data);
    try {
      const response = await loginUser(data).unwrap();
      // console.log(response);
      const {token, user} = response;
      toast.success("Login successful");
      dispatch(setUser({user}));
      navigate("/");
    } catch (error) {
      setMessage("Please provide a valid email and password!");
      toast.error("Login Failed!");
      // console.log("Login Failed",error);
    }
  }

  return (
    <section className="h-screen w-full flex items-center justify-center">
      <div className="shadow bg-white p-8 max-w-sm mx-auto ">
        <h2 className=" text-2xl font-semibold pt-5">Please Login</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 max-w-sm mx-auto pt-6"
        >
          <input
            {...register("email", { required: true })}
            type="email"
            placeholder="Email"
            required
            className="w-full bg-gray-100 focus:outline-none px-5 py-3"
          />
          
          {errors.email && <p className="text-red-500">Email is required</p>}

          <input
            {...register("password", { required: true })}
            type="password"
            placeholder="Password"
            required
            className="w-full bg-gray-100 focus:outline-none px-5 py-3"
          />

          {errors.password && <p className="text-red-500">Password is required</p>}

          {message && <p className="text-red-500">{message}</p>}
          <button className="w-full mt-5 bg-primary hover:bg-primary/85 text-white font-medium py-3 rounded-md">
            Login
          </button>
        </form>
        <div className="my-5 italic text-sm">
          Don't have account?{" "}
          <Link
            to="/register"
            className="text-primary underline hover:cursor-pointer"
          >
            Register 
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Login;
