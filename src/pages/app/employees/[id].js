// pages/app/employees/[id].js

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function EditEmployee() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    employeeNo: "", // This will be read-only
  });
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      const fetchEmployee = async () => {
        const res = await fetch(`/api/employee/${id}`);
        const data = await res.json();
        setFormData(data);
      };
      fetchEmployee();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/employee/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender, // Send updated data except employeeNo
      }),
    });

    if (res.ok) {
      router.push("/app/employees");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Employee</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label>Last Name</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label>Gender</label>
          <select
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            className="border p-2 rounded w-full"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label>Employee No (Read-Only)</label>
          <input
            type="text"
            value={formData.employeeNo}
            readOnly
            className="border p-2 rounded w-full bg-gray-100 cursor-not-allowed"
          />
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
          Submit
        </button>
      </form>
    </div>
  );
}
