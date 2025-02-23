import LoginForm from "../../ui/forms/login-form";
import AuthPage from "../../ui/pages/auth-page"; // Import AuthLayout

export default function LogIn() {
  return (
    <AuthPage title="Sign in to your account">
      <LoginForm />
    </AuthPage>
  );
}
