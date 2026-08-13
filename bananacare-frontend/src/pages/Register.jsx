import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Leaf, User, Mail, Lock, Phone, Languages } from "lucide-react";

import { registerUser } from "../services/authService";

import "./Register.css";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        preferredLanguage: "English",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const response = await registerUser(formData);

            setSuccess(response.message || "Registration Successful!");

            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Registration failed."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="register-card">

                <div className="login-brand">
                    <div className="brand-icon">
                        <Leaf size={32} />
                    </div>

                    <h1>BananaCare</h1>
                    <p>Create your account</p>
                </div>

                <h2>Create Account</h2>

                {error && <div className="login-error">{error}</div>}
                {success && <div className="success-msg">{success}</div>}

                <form onSubmit={handleSubmit} className="login-form">

                    <div className="input-wrapper">
                        <User size={18}/>
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-wrapper">
                        <Mail size={18}/>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-wrapper">
                        <Lock size={18}/>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-wrapper">
                        <Phone size={18}/>
                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-wrapper">
                        <Languages size={18}/>
                        <select
                            name="preferredLanguage"
                            value={formData.preferredLanguage}
                            onChange={handleChange}
                        >
                            <option>English</option>
                            <option>Hindi</option>
                            <option>Marathi</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? "Creating Account..." : "Register"}
                    </button>

                </form>

                <div className="register-link">
                    Already have an account?{" "}
                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>
                </div>

            </div>
        </div>
    );
}

export default Register;