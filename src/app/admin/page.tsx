"use client";

import { useRouter } from "next/navigation";
import { DepartmentSelector } from "@/components/departmentSelector";

export default function AdminSelectorPage() {
  const router = useRouter();

  // This function is passed to the DepartmentSelector component.
  // It will ONLY be called by the component after a correct PIN is entered.
  const handleSuccessfulLogin = (departmentId: string) => {
    // Navigate to the dynamic admin page for the selected department.
    router.push(`/admin/${departmentId}`);
  };

  return (
    <DepartmentSelector
      onDepartmentSelect={handleSuccessfulLogin}
    />
  );
}