import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Leaf, Mail, Lock, LoaderCircle } from "lucide-react";

import {
    loginUser,
    saveToken,
} from "../services/authService";

import "./Login.css";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const data = await loginUser({
                email,
                password,
            });

            console.log("Login response:", data);

            /*
             * Your Spring Boot LoginResponse should contain
             * the JWT token.
             *
             * This supports common names while we verify
             * the exact response.
             */
            const token =
                data.token ||
                data.jwt ||
                data.accessToken;

            if (!token) {
                throw new Error(
                    "Login successful but JWT token was not found."
                );
            }

            saveToken(token);

            navigate("/dashboard");
        } catch (err) {
            console.error("Login error:", err);

            const message =
                err.response?.data?.message ||
                err.response?.data?.error ||
                err.message ||
                "Login failed. Please check your credentials.";

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">

                <div className="login-brand">
                    <div className="brand-icon">
                        <Leaf size={32} />
                    </div>

                    <h1>BananaCare</h1>

                    <p>
                        AI-powered banana plantation health management
                    </p>
                </div>

                <div className="login-heading">
                    <h2>Welcome Back</h2>
                    <p>Sign in to manage your plantations</p>
                </div>

                {error && (
                    <div className="login-error">
                        {error}
                    </div>
                )}

                <form
                    className="login-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-group">
                        <label htmlFor="email">
                            Email Address
                        </label>

                        <div className="input-wrapper">
                            <Mail size={20} />

                            <input
                                id="email"
                                type="email"
                                placeholder="farmer@example.com"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">
                            Password
                        </label>

                        <div className="input-wrapper">
                            <Lock size={20} />

                            <input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                required
                            />
                        </div>
                    </div>

                    <button
                        className="login-button"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <LoaderCircle
                                    size={20}
                                    className="spinner"
                                />
                                Signing in...
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </button>

                </form>

                <div className="register-link">
                    <span>Don't have an account?</span>

                    <button
                        type="button"
                        onClick={() => navigate("/register")}
                    >
                        Create Account
                    </button>
                </div>

            </div>
        </div>
    );
}

export default Login;