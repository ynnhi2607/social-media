import React, { useState } from "react";
import * as authService from "../services/authService";
import Button from "./ui/Button";

const QuickLogin = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("login"); // 'login' or 'register'
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    email: "",
    username: "",
    password: "",
    fullName: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login({
        emailOrUsername: formData.emailOrUsername,
        password: formData.password,
      });

      console.log("Login successful:", response);
      alert("Login successful!");
      onLoginSuccess && onLoginSuccess(response.data.user);
    } catch (error) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.register({
        email: formData.email,
        username: formData.username,
        password: formData.password,
        fullName: formData.fullName,
      });

      console.log("Registration successful:", response);
      alert("Registration successful! You are now logged in.");
      onLoginSuccess && onLoginSuccess(response.data.user);
    } catch (error) {
      console.error("Registration error:", error);
      alert(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const quickLoginDemo = async () => {
    setLoading(true);
    try {
      // Try to login with demo account
      const response = await authService.login({
        emailOrUsername: "testuser",
        password: "123456",
      });
      console.log("✅ Demo login successful!");
      alert("✅ Demo login successful!");
      onLoginSuccess && onLoginSuccess(response.data.user);
    } catch (error) {
      console.log("Demo login failed, trying to register...", error);

      // If demo account doesn't exist, create it
      // Check if error is "Invalid credentials" (user doesn't exist)
      const errorMsg = error.response?.data?.message || error.message;

      if (
        errorMsg.includes("Invalid credentials") ||
        error.response?.status === 404
      ) {
        try {
          const registerResponse = await authService.register({
            email: "testuser@demo.com",
            username: "testuser",
            password: "123456",
            fullName: "Test User",
          });
          console.log("✅ Demo account created and logged in!");
          alert("✅ Demo account created and logged in!");
          onLoginSuccess && onLoginSuccess(registerResponse.data.user);
        } catch (regError) {
          const regErrorMsg =
            regError.response?.data?.message || regError.message;
          console.error("Failed to setup demo account:", regErrorMsg);
          alert(
            "❌ Failed to setup demo account. Please try manual login.\n\nError: " +
              regErrorMsg,
          );
        }
      } else {
        // Login failed for other reason (e.g., wrong password)
        console.error("Demo login error:", errorMsg);
        alert(
          "❌ Demo login failed. Try manual login with:\nUsername: testuser\nPassword: 123456",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-80">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          {mode === "login" ? "Login" : "Register"}
        </h3>
        <button
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="text-sm text-blue-600 hover:underline"
        >
          {mode === "login" ? "Register?" : "Login?"}
        </button>
      </div>

      {mode === "login" ? (
        <form onSubmit={handleLogin} className="space-y-3">
          <input
            type="text"
            placeholder="Email or Username"
            value={formData.emailOrUsername}
            onChange={(e) =>
              setFormData({ ...formData, emailOrUsername: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleRegister} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password (min 6 chars)"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
            minLength={6}
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>
      )}

      <div className="mt-3 pt-3 border-t">
        <Button
          onClick={quickLoginDemo}
          disabled={loading}
          variant="outline"
          className="w-full"
        >
          🚀 Quick Demo Login
        </Button>
      </div>

      <p className="text-xs text-gray-500 mt-2 text-center">
        {authService.isAuthenticated()
          ? "✅ Logged in as " + authService.getUser()?.username
          : "⚠️ Not logged in"}
      </p>
    </div>
  );
};

export default QuickLogin;
