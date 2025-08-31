import AuthLayout from "@/layout/AuthLayout";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { requestPasswordReset } from "@/services/apiMethods";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      await requestPasswordReset({ email });
      setMessage("Password reset link sent to your email.");
      setEmail("");
    } catch (err) {
      setError(err.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="grid w-full h-full place-items-center">
        <div className="w-full max-w-md p-6 bg-card rounded-lg shadow-md">
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold">Reset Password</h1>
              <p className="text-muted-foreground text-sm text-balance">
                Enter your email to receive a password reset link.
              </p>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            {error && <p className="text-destructive text-sm text-center">{error}</p>}
            {message && <p className="text-primary text-sm text-center">{message}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
            <Button variant="link" className="w-full" onClick={() => navigate("/login")} disabled={loading}>
              Back to Login
            </Button>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}
