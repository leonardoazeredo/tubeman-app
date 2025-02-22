import SignUpForm from "../../ui/signup-form";
import AuthLayout from "../../ui/layouts/auth-layout"; // Import AuthLayout

export default function SignUp() {
  return (
    <AuthLayout title="Create an account">
      <SignUpForm />
    </AuthLayout>
  );
}
