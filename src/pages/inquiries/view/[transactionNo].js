// pages/inquiries/view/[transactionNo].js

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"; 

export default function InquiryDetails() {
  const router = useRouter();
  const { transactionNo } = router.query;
  const [inquiry, setInquiry] = useState(null);

  useEffect(() => {
    if (transactionNo) {
      const fetchInquiry = async () => {
        const res = await fetch(`/api/inquiries/view/${transactionNo}`);
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
            <p className="border border-gray-300 rounded-lg p-4"><strong>Transaction No:</strong> {inquiry.transactionNo}</p>
          </div>
          <div>
            <p className="border border-gray-300 rounded-lg p-4"><strong>First Name:</strong> {inquiry.firstName}</p>
          </div>
          <div>
            <p className="border border-gray-300 rounded-lg p-4"><strong>Last Name:</strong> {inquiry.lastName}</p>
          </div>
          <div>
            <p className="border border-gray-300 rounded-lg p-4"><strong>Contact Number:</strong> {inquiry.contactNo}</p>
          </div>
          <div>
            <p className="border border-gray-300 rounded-lg p-4"><strong>Email Address:</strong> {inquiry.emailAddress}</p>
          </div>
          <div>
            <p className="border border-gray-300 rounded-lg p-4"><strong>Subject:</strong> {inquiry.subject}</p>
          </div>
          <div>
            <p className="border border-gray-300 rounded-lg p-4"><strong>Message:</strong> {inquiry.message}</p>
          </div>
          <div>
            <p className="border border-gray-300 rounded-lg p-4"><strong>Created At:</strong> {new Date(inquiry.created).toLocaleString()}</p>
          </div>
          <div>
            <p className="border border-gray-300 rounded-lg p-4"><strong>Modified At:</strong> {new Date(inquiry.modified).toLocaleString()}</p>
          </div>
        </div>
        <div className="mt-6">
        <Button
            variant="primary"
            onClick={() => router.push("/inquiries")}
            className="px-4 py-2 rounded-md font-semibold transition-colors duration-200
              bg-gray-800 text-white hover:bg-gray-700 dark:bg-white dark:text-gray-800 dark:hover:bg-gray-300"
          >
            ← Back to Inquiries
          </Button>
        </div>
      </div>
    </div>
  );
}
