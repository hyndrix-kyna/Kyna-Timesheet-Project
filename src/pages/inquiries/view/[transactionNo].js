// pages/inquiries/view/[transactionNo].js

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"; // Shadcn UI button component

export default function InquiryDetails() {
  const router = useRouter();
  const { transactionNo } = router.query; // Get transactionNo from the URL
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

  if (!inquiry) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Inquiry Details</h1>
      <div className="space-y-4">
        <p><strong>First Name:</strong> {inquiry.firstName}</p>
        <p><strong>Last Name:</strong> {inquiry.lastName}</p>
        <p><strong>Contact Number:</strong> {inquiry.contactNo}</p>
        <p><strong>Email Address:</strong> {inquiry.emailAddress}</p>
        <p><strong>Subject:</strong> {inquiry.subject}</p>
        <p><strong>Message:</strong> {inquiry.message}</p>
        <p><strong>Status:</strong> {inquiry.status}</p>
        <p><strong>Created At:</strong> {new Date(inquiry.created).toLocaleString()}</p>
        <p><strong>Modified At:</strong> {new Date(inquiry.modified).toLocaleString()}</p>
        <Button variant="primary" onClick={() => router.push("/inquiries")}>
          Back to Inquiries
        </Button>
      </div>
    </div>
  );
}
