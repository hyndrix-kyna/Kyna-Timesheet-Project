// src/pages/contact.js
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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (response.ok) setSubmitted(true);
        else console.error("Failed to submit inquiry");
      } catch (error) {
        console.error("Error submitting form", error);
      }
    },
  });

  return (
    <div className="formWrapper w-full max-w-md p-8 border border-border rounded-lg shadow-lg mx-auto bg-background text-foreground mt-12">
      <h1 className="heading text-5xl font-bold mb-8 text-center">Contact Us</h1>
      {submitted ? (
        <p className="formStatus text-green-500 text-center mt-4">Thank you! Your inquiry has been submitted.</p>
      ) : (
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {["firstName", "lastName", "contactNo", "emailAddress", "subject"].map((field, index) => (
            <div key={index}>
              <label className="block text-sm font-medium mb-1 text-foreground">
                {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </label>
              <Input
                type={field === "emailAddress" ? "email" : "text"}
                name={field}
                onChange={formik.handleChange}
                value={formik.values[field]}
                className={`inputField border p-2 w-full rounded-md ${
                  formik.errors[field] ? "border-red-500" : "border-gray-300 dark:border-gray-400"
                }`}
              />
              {formik.errors[field] && <p className="errorMessage text-red-500 text-sm">{formik.errors[field]}</p>}
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Message</label>
            <Textarea
              name="message"
              onChange={formik.handleChange}
              value={formik.values.message}
              className={`textareaField h-32 border p-2 w-full rounded-md ${
                formik.errors.message ? "border-red-500" : "border-gray-300 dark:border-gray-400"
              }`}
            />
            {formik.errors.message && <p className="errorMessage text-red-500 text-sm">{formik.errors.message}</p>}
          </div>
          <Button
            type="submit"
            className="w-full bg-black text-white hover:bg-gray-700 dark:bg-white dark:text-black dark:hover:bg-gray-300 transition-colors py-2 rounded-md"
          >
            Submit
          </Button>
        </form>
      )}
    </div>
  );
}
