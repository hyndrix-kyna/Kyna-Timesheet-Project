// New /src/pages/app/payout.js

import { useState, useEffect } from "react";
import { useSession, getSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Payout() {
  const { data: session } = useSession();
  const [payoutMode, setPayoutMode] = useState("Automatic");
  const [payoutFrequency, setPayoutFrequency] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [payoutDates, setPayoutDates] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (session?.user) {
      fetchPayoutDates();
    }
  }, [session]);

  const fetchPayoutDates = async () => {
    try {
      const res = await fetch(`/api/payout/${session.user.employeeID}`);
      const data = await res.json();
      if (res.ok) {
        setPayoutDates(data);
      } else {
        setError("Failed to load payout data.");
      }
    } catch (err) {
      setError("Error fetching payout data.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/payout/${session.user.employeeID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payoutMode,
          payoutFrequency,
          startDate,
          endDate,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Payout submitted successfully");
        fetchPayoutDates(); // Refresh the payout dates
      } else {
        setError(data.error || "Failed to submit payout");
      }
    } catch (err) {
      setError("Error submitting payout.");
    }
  };

  return (
    <div className="flex flex-col h-screen items-center bg-gray-100 dark:bg-gray-800 p-6">
      <h1 className="text-3xl font-bold mb-4">EMPLOYEE</h1>
      <div className="flex space-x-4 mb-6">
        <Link href="/app/employees" className="text-lg font-semibold text-blue-500 hover:underline">
          Payrate
        </Link>
        <Link href="/app/payout" className="text-lg font-semibold text-blue-500 hover:underline">
          Payout
        </Link>
      </div>

      <div className="w-full max-w-4xl bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md border border-gray-300">
        <h2 className="text-xl font-semibold mb-6">Set payout schedule</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Choose a way to set the payout schedule</label>
            <select
              value={payoutMode}
              onChange={(e) => setPayoutMode(e.target.value)}
              className="w-full border p-2 rounded-lg text-black dark:text-white mb-4"
            >
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>
          </div>

          {payoutMode === "Automatic" ? (
            <div>
              <label>Select a Payout Frequency</label>
              <select
                value={payoutFrequency}
                onChange={(e) => setPayoutFrequency(e.target.value)}
                className="w-full border p-2 rounded-lg text-black dark:text-white mb-4"
              >
                <option value="">Select a Payout Frequency</option>
                <option value="Daily">Daily</option>
                <option value="Bi-Monthly">Bi-Monthly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>
          ) : (
            <div>
              <label>Enter a Start Date and End Date</label>
              <div className="flex space-x-4 mb-4">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  placeholderText="Pick a Start Date"
                  className="w-full border p-2 rounded-lg text-black dark:text-white"
                />
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  placeholderText="Pick an End Date"
                  className="w-full border p-2 rounded-lg text-black dark:text-white"
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Submit
          </Button>
        </form>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="mt-8 w-full max-w-4xl bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md border border-gray-300">
        <h2 className="text-xl font-semibold mb-4">Payout Dates</h2>
        {payoutDates.length > 0 ? (
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                {['Payout Date', 'Duration', 'Payroll Amount', 'Status', 'Completed'].map((header, index) => (
                  <th key={index} className="border border-gray-300 p-2">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payoutDates.map((entry, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">{new Date(entry.payoutDate).toLocaleDateString("en-US")}</td>
                  <td className="border border-gray-300 p-2">{entry.duration} hrs</td>
                  <td className="border border-gray-300 p-2">${entry.payrollAmount.toFixed(2)}</td>
                  <td className="border border-gray-300 p-2">{entry.status}</td>
                  <td className="border border-gray-300 p-2">{entry.completed ? "Complete" : "Pending"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No payouts have been made.</p>
        )}
      </div>
    </div>
  );
}

// Server-side session check
export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/account/login",
        permanent: false,
      },
    };
  }

  return { props: { session } };
}
