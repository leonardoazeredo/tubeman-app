import SignUpForm from "../ui/signup-form";

export default function SignUp() {
  return (
    <body className="antialiased">
      <main className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Create an account
            </h2>
          </div>
          <SignUpForm />
        </div>
      </main>
    </body>
  );
}
