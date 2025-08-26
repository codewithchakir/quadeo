import LoginForm from "@/components/Auth/LoginForm";

export const metadata = {
  title: "Login - Quadeo",
};

export default function LoginPage() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: "url('/login-bg.jpeg')", // Replace with your image path
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <LoginForm />
    </div>
  );
}