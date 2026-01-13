import { RegisterForm } from "@/components/register-form";

export default function Page() {
  return (
    <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Enregistrement</h1>
      </div>

      <div className="space-y-4">
        <RegisterForm />
      </div>

      <hr className="max-w-sm" />
    </div>
  );
}
