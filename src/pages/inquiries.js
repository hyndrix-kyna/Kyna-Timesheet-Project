// pages/inquiries.js

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"; // Shadcn UI button component

export default function Inquiries() {
  const [inquiries, setInquiries] = useState([]);

  // Fetch inquiries from the API
  useEffect(() => {
    const fetchInquiries = async () => {
      const res = await fetch("/api/inquiries");
      const data = await res.json();
      setInquiries(data);
    };

    fetchInquiries();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">All Inquiries</h1>

      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">First Name</th>
            <th className="border border-gray-300 p-2">Last Name</th>
            <th className="border border-gray-300 p-2">Contact No</th>
            <th className="border border-gray-300 p-2">Email Address</th>
            <th className="border border-gray-300 p-2">Subject</th>
            <th className="border border-gray-300 p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {inquiries.map((inquiry) => (
            <tr key={inquiry.id}>
              <td className="border border-gray-300 p-2">{inquiry.firstName}</td>
              <td className="border border-gray-300 p-2">{inquiry.lastName}</td>
              <td className="border border-gray-300 p-2">{inquiry.contactNo}</td>
              <td className="border border-gray-300 p-2">{inquiry.emailAddress}</td>
              <td className="border border-gray-300 p-2">{inquiry.subject}</td>
              <td className="border border-gray-300 p-2">
                <Button variant="outline" onClick={() => window.location.href = `/inquiries/view/${inquiry.transactionNo}`}>
                  View Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
