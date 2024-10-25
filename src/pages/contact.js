// pages/contact.js
import { useFormik } from "formik";
import { contactValidation } from "@/lib/validation/contactValidation";
import { useState } from "react";
import { Button } from "@/components/ui/button"; 
import { Input } from "@/components/ui/input"; 
import { Textarea } from "@/components/ui/textarea"; 

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      contactNo: "",
      emailAddress: "",
      subject: "",
      message: "",
    },
    validationSchema: contactValidation,
    onSubmit: async (values) => {
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          setSubmitted(true);
        } else {
          console.error("Failed to submit inquiry");
        }
      } catch (error) {
        console.error("Error submitting form", error);
      }
    },
  });

  return (
    <div className="container mx-auto">
      <h1>Contact Us</h1>
      {submitted ? (
        <p>Thank you! Your inquiry has been submitted.</p>
      ) : (
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label>First Name</label>
            <Input
              type="text"
              name="firstName"
              onChange={formik.handleChange}
              value={formik.values.firstName}
              className={formik.errors.firstName ? "input-error" : ""}
            />
            {formik.errors.firstName && <p className="text-red-500">{formik.errors.firstName}</p>}
          </div>
          <div>
            <label>Last Name</label>
            <Input
              type="text"
              name="lastName"
              onChange={formik.handleChange}
              value={formik.values.lastName}
              className={formik.errors.lastName ? "input-error" : ""}
            />
            {formik.errors.lastName && <p className="text-red-500">{formik.errors.lastName}</p>}
          </div>
          <div>
            <label>Contact Number</label>
            <Input
              type="text"
              name="contactNo"
              onChange={formik.handleChange}
              value={formik.values.contactNo}
              className={formik.errors.contactNo ? "input-error" : ""}
            />
            {formik.errors.contactNo && <p className="text-red-500">{formik.errors.contactNo}</p>}
          </div>
          <div>
            <label>Email Address</label>
            <Input
              type="email"
              name="emailAddress"
              onChange={formik.handleChange}
              value={formik.values.emailAddress}
              className={formik.errors.emailAddress ? "input-error" : ""}
            />
            {formik.errors.emailAddress && <p className="text-red-500">{formik.errors.emailAddress}</p>}
          </div>
          <div>
            <label>Subject</label>
            <Input
              type="text"
              name="subject"
              onChange={formik.handleChange}
              value={formik.values.subject}
              className={formik.errors.subject ? "input-error" : ""}
            />
            {formik.errors.subject && <p className="text-red-500">{formik.errors.subject}</p>}
          </div>
          <div>
            <label>Message</label>
            <Textarea
              name="message"
              onChange={formik.handleChange}
              value={formik.values.message}
              className={formik.errors.message ? "input-error" : ""}
            />
            {formik.errors.message && <p className="text-red-500">{formik.errors.message}</p>}
          </div>
          <Button type="submit" variant="primary">
            Submit
          </Button>
        </form>
      )}
    </div>
  );
}
