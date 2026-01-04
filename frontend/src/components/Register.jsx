import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useRegisterUserMutation } from "../redux/features/auth/authApi";
import { toast } from "react-toastify";

const Register = () => {
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [registerUser, { isLoading, error }] = useRegisterUserMutation();
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    // console.log(data);
    try {
      await registerUser(data).unwrap();
      toast.success("Registration successful");
      navigate("/login"); // Redirect to the login page after successful registration
    } catch (error) {
      setMessage("Registration Failed");
      toast.error("Registration Failed");
      // console.log("Registration Failed", error);
    }
  };

  return (
    <section className="h-screen w-full flex items-center justify-center">
      <div className="shadow bg-white p-8 max-w-sm mx-auto ">
        <h2 className=" text-2xl font-semibold pt-5">Please Register</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 max-w-sm mx-auto pt-6"
        >


        <input
            {...register("username", { required: true })}
            type="username"
            placeholder="Ex: hello_user"
            required
            className="w-full bg-gray-100 focus:outline-none px-5 py-3"
          />

          {errors.username && <p className="text-red-500">Username is required</p>}

          <input
            {...register("email", { required: true })}
            type="email"
            placeholder="user@example.com"
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

          {errors.password && (
            <p className="text-red-500">Password is required</p>
          )}

          {message && <p className="text-red-500">Your given info should be unique.</p>}

          <button className="w-full mt-5 bg-primary hover:bg-primary/85 text-white font-medium py-3 rounded-md">
            Register
          </button>
        </form>
        <div className="my-5 italic text-sm">
          Already have account?{" "}
          <Link
            to="/login"
            className="text-primary underline hover:cursor-pointer"
          >
            Login
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Register;
