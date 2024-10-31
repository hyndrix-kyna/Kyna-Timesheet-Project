// pages/inquiries/view/[transactionNo].js

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"; // Shadcn UI button component

export default function InquiryDetails() {
  const router = useRouter();
  const { transactionNo } = router.query;
  const [inquiry, setInquiry] = useState(null);

  useEffect(() => {
    if (transactionNo) {
      const fetchInquiry = async () => {
        const res = await fetch(`/api/inquiries/${transactionNo}`);
        const data = await res.json();
        setInquiry(data);
      };
      fetchInquiry();
    }
  }, [transactionNo]);

  if (!inquiry) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Inquiry Details</h1>
      <div className="border border-gray-300 rounded-lg p-6 bg-background shadow-md">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <p><strong>Transaction No:</strong> {inquiry.transactionNo}</p>
          </div>
          <div>
            <p><strong>First Name:</strong> {inquiry.firstName}</p>
          </div>
          <div>
            <p><strong>Last Name:</strong> {inquiry.lastName}</p>
          </div>
          <div>
            <p><strong>Contact Number:</strong> {inquiry.contactNo}</p>
          </div>
          <div>
            <p><strong>Email Address:</strong> {inquiry.emailAddress}</p>
          </div>
          <div className="col-span-2">
            <p><strong>Subject:</strong> {inquiry.subject}</p>
          </div>
          <div className="col-span-2">
            <p><strong>Message:</strong> {inquiry.message}</p>
          </div>
          <div>
            <p><strong>Created At:</strong> {new Date(inquiry.created).toLocaleString()}</p>
          </div>
          <div>
            <p><strong>Modified At:</strong> {new Date(inquiry.modified).toLocaleString()}</p>
          </div>
        </div>
        <div className="mt-6">
          <Button variant="primary" onClick={() => router.push("/inquiries")}>
            Back to Inquiries
          </Button>
        </div>
      </div>
    </div>
  );
}
