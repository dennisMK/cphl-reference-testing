import ViralLoadForm from "@/app/_components/forms/viral-load-form";

export default function ViralLoadPage() {
  const handleFormSubmit = (data: any) => {
    console.log("Viral Load Form Submitted:", data);
    // Here you would typically send the data to your API
  };

  return (
    <div className="container mx-auto py-8">
      <ViralLoadForm onSubmit={handleFormSubmit} />
    </div>
  );
} 