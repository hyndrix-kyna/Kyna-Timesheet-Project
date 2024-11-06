// /src/pages/inquiries/edit/[transactionNo].js

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
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit Inquiry</h1>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Transaction No</label>
          <Input
            type="text"
            name="transactionNo"
            value={formik.values.transactionNo}
            readOnly
            className="bg-gray-100 cursor-not-allowed"
          />
        </div>
        {["firstName", "lastName", "contactNo", "emailAddress", "subject"].map((field, index) => (
          <div key={index}>
            <label className="block text-sm font-medium mb-1">{field.replace(/([A-Z])/g, ' $1')}</label>
            <Input
              type="text"
              name={field}
              onChange={formik.handleChange}
              value={formik.values[field]}
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
          />
        </div>
        <Button type="submit" variant="primary" className="mt-4">
          Save Changes
        </Button>
      </form>
    </div>
  );
}
