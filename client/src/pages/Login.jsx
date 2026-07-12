import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const redirectTo =
        location.state?.from?.pathname || "/admin/dashboard";

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            await login(username, password);
            navigate(redirectTo, { replace: true });
        } catch (err) {
            setError(
                err?.response?.data?.detail ||
                err?.message ||
                "Invalid username or password."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-5">

            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
            >

                <h1 className="text-3xl font-bold text-center mb-2">
                    NOVA TV
                </h1>

                <p className="text-center text-gray-500 mb-8">
                    Admin Login
                </p>

                {error && (
                    <div className="mb-4 rounded-lg bg-red-100 text-red-700 p-3">
                        {error}
                    </div>
                )}

                <input
                    type="text"
                    placeholder="Username"
                    className="w-full border rounded-lg p-3 mb-4"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border rounded-lg p-3 mb-6"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-red-600 text-white rounded-lg p-3 font-semibold"
                >
                    {loading ? "Signing in..." : "Login"}
                </button>

            </form>

        </div>
    );
}
