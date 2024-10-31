import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function Inquiries() {
  const [inquiries, setInquiries] = useState([]);

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
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">All Inquiries</h1>
        </CardHeader>
        <CardContent>
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr>
                {["First Name", "Last Name", "Contact No", "Email Address", "Subject", "Action"].map((header, index) => (
                  <th key={index} className="border border-gray-300 p-2">{header}</th>
                ))}
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
        </CardContent>
      </Card>
    </div>
  );
}
