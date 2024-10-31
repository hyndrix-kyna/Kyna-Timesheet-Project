// pages/inquiries/edit/[transactionNo].js

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function EditInquiry() {
  const router = useRouter();
  const { transactionNo } = router.query;
  const [initialValues, setInitialValues] = useState({
    transactionNo: "",
    firstName: "",
    lastName: "",
    contactNo: "",
    emailAddress: "",
    subject: "",
    message: ""
  });

  useEffect(() => {
    if (transactionNo) {
      const fetchInquiry = async () => {
        const res = await fetch(`/api/inquiries/view/${transactionNo}`);
        if (res.ok) {
          const data = await res.json();
          setInitialValues({
            transactionNo: data.transactionNo,
            firstName: data.firstName,
            lastName: data.lastName,
            contactNo: data.contactNo,
            emailAddress: data.emailAddress,
            subject: data.subject,
            message: data.message
          });
        } else {
          console.error("Failed to fetch inquiry data");
        }
      };
      fetchInquiry();
    }
  }, [transactionNo]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: async (values) => {
      try {
        const response = await fetch(`/api/inquiries/update/${transactionNo}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values)
        });
        if (response.ok) {
          router.push("/inquiries");
        } else {
          console.error("Failed to update inquiry");
        }
      } catch (error) {
        console.error("Error updating inquiry", error);
      }
    }
  });

  if (!transactionNo) return <div>Loading...</div>;

  return (
    <div className="container mx-auto border border-gray-300 rounded-lg mt-8 p-6 max-w-2xl">
      {/* Back to Inquiries Button */}
      <Button
            variant="outline"
            className="mb-6 mt-2 px-4 py-2 flex items-center text-sm font-semibold text-gray-600 hover:text-gray-800 dark:border-gray-300 dark:text-gray-300 dark:hover:text-white transition-all"
            onClick={() => router.push("/inquiries")}
        >
            <span className="mr-2">←</span> Back to Inquiries
        </Button>
      <h1 className="text-2xl font-bold mb-6 ">Edit Inquiry</h1>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Transaction No</label>
          <Input
            type="text"
            name="transactionNo"
            value={formik.values.transactionNo}
            readOnly
            className="bg-gray-100 dark:bg-gray-700 dark:text-gray-300 cursor-not-allowed"
          />
        </div>
        {["firstName", "lastName", "contactNo", "emailAddress", "subject"].map((field, index) => (
          <div key={index}>
            <label className="block text-sm font-medium mb-1">{field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
            <Input
              type="text"
              name={field}
              onChange={formik.handleChange}
              value={formik.values[field]}
              className="border border-gray-300 dark:border-gray-300 dark:text-gray-300"
            />
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium mb-1">Message</label>
          <Textarea
            name="message"
            onChange={formik.handleChange}
            value={formik.values.message}
            rows="4"
            className="border border-gray-300 dark:border-gray-300 bg-background dark:text-gray-300"
          />
        </div>
        <Button
            type="submit"
            variant="primary"
            className="mt-4 px-4 py-2 bg-gray-800 text-white dark:bg-white dark:text-gray-800 hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors rounded-md"
        >
            Save Changes
        </Button>
        
      </form>
    </div>
  );
}
