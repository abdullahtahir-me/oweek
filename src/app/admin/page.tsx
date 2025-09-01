"use client";

import { useRouter } from "next/navigation";
import { DepartmentSelector } from "@/components/departmentSelector";

export default function AdminSelectorPage() {
  const router = useRouter();

  // This handler now uses the Next.js router to navigate to the dynamic
  // admin page for the selected department.
  const handleDepartmentSelect = (departmentId: string) => {
    router.push(`/admin/${departmentId}`);
  };

  return (
    <DepartmentSelector />
  );
}