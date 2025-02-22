import SignUpForm from "../../ui/signup-form";
import AuthPage from "../../ui/pages/auth-page"; // Import AuthLayout

export default function SignUp() {
  return (
    <AuthPage title="Create an account">
      <SignUpForm />
    </AuthPage>
  );
}
