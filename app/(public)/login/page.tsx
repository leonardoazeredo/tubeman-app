import LoginForm from "../../ui/login-form";
import AuthLayout from "../../ui/layouts/auth-layout"; // Import AuthLayout

export default function LogIn() {
  return (
    <AuthLayout title="Sign in to your account">
      <LoginForm />
    </AuthLayout>
  );
}
