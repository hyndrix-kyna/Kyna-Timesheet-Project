import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid"; // Import the uuid package for generating a unique employeeNo

export default function CreateEmployee() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    employeeNo: "",
  });
  const router = useRouter();

  // Generate the employeeNo when the component is mounted
  useEffect(() => {
    const generateEmployeeNo = () => {
      // Generate a 6-character unique employee number
      const employeeNo = uuidv4().slice(0, 6); // Slice to get the first 6 characters
      setFormData((prevData) => ({
        ...prevData,
        employeeNo: employeeNo,
      }));
    };

    generateEmployeeNo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/employee", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      router.push("/app/employees");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Employee</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <div>
          <label>Last Name</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <div>
          <label>Gender</label>
          <select
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            className="border p-2 rounded w-full"
            required
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label>Employee No (Auto-generated)</label>
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
