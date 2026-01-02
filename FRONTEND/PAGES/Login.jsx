// Login.jsx
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../src/authSlice";
import { Eye, EyeOff } from "lucide-react";

/* ------------------ Validation Schema ------------------ */
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      "Password must contain uppercase, lowercase, number & special character"
    ),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector(
    (state) => state.auth.isAuthenticated
  );

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async  (data) => {
    try{
        await  dispatch(loginUser(data)).unwrap();
    
      navigate("/");
    }
    catch (err) {
    
    const errorMessage = 
      err?.message || 
      err?.error || 
      err?.data?.message || 
      err?.data?.error ||
      err?.response?.data?.message || 
      err?.toString() || 
      "Login failed";
    
    alert(`Error: ${errorMessage}`);
  }
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-base-200 to-base-300 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-300/60">
        <div className="card-body gap-6">

          
          <div className="text-center">
            <h2 className="text-3xl font-semibold">CodeBytes</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            
            <div className="form-control">
              <input
                type="email"
                placeholder="john@example.com"
                className={`input input-bordered ${
                  errors.email ? "input-error" : ""
                }`}
                {...register("email")}
              />
              {errors.email && (
                <span className="text-error text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="form-control relative">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                className={`input input-bordered pr-10 ${
                  errors.password ? "input-error" : ""
                }`}
                {...register("password")}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>

              {errors.password && (
                <span className="text-error text-sm">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Signup Link */}
            <p className="text-sm text-center">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-primary hover:underline"
              >
                Sign up
              </Link>
            </p>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary w-full">
              Login
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
