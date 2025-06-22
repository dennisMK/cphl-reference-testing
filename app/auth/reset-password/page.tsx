import { Suspense } from "react";
import { ResetPasswordForm } from "../../_components/auth/reset-password-form";

function ResetPasswordPageContent() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <ResetPasswordForm />
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    }>
      <ResetPasswordPageContent />
    </Suspense>
  );
} 