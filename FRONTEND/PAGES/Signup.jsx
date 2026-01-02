import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerUser } from "../src/authSlice";
import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff } from "lucide-react";

/*  Validation Schema  OF ZOD*/
const signupSchema = z
  .object({
    firstName: z.string().min(3).max(20),
    email: z.string().email(),
    password: z
      .string()
      .min(8)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        "Password must contain uppercase, lowercase, number & special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.auth.loading);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data) => {
    try {
      await dispatch(registerUser(data)).unwrap();
     alert (`User ${data.firstName} created!`)
      navigate("/login");
    } catch (err) {
      alert("Error: " + err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body gap-5">
          <h2 className="text-3xl font-semibold text-center text-primary">
            CodeBytes
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <input
              className={`input input-bordered w-full ${
                errors.firstName && "input-error"
              }`}
              placeholder="Full Name"
              {...register("firstName")}
            />
            {errors.firstName && (
              <p className="text-error text-sm">{errors.firstName.message}</p>
            )}

            {/* Email */}
            <input
              className={`input input-bordered w-full ${
                errors.email && "input-error"
              }`}
              placeholder="Email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-error text-sm">{errors.email.message}</p>
            )}

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className={`input input-bordered w-full pr-10 ${
                  errors.password && "input-error"
                }`}
                placeholder="Password"
                {...register("password")}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
            {errors.password && (
              <p className="text-error text-sm">{errors.password.message}</p>
            )}

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className={`input input-bordered w-full pr-10 ${
                  errors.confirmPassword && "input-error"
                }`}
                placeholder="Confirm Password"
                {...register("confirmPassword")}
              />
              <span
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </span>
            </div>
            {errors.confirmPassword && (
              <p className="text-error text-sm">
                {errors.confirmPassword.message}
              </p>
            )}

            {/* Button */}
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;