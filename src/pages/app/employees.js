// /src/pages/app/employees.js

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export default function Employees() {
  const { data: session, status } = useSession();
  const [payRateHistory, setPayRateHistory] = useState([]);
  const [payPeriod, setPayPeriod] = useState("Daily");
  const [payRate, setPayRate] = useState(500); // Default to 500 for testing
  const [payRateSchedule, setPayRateSchedule] = useState("Hourly");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.employeeID) {
      fetchPayRateHistory();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [session, status]);

  const fetchPayRateHistory = async () => {
    try {
      const employeeID = session.user.employeeID;
      const res = await fetch(`/api/employee/${employeeID}`);

      if (!res.ok) {
        const errorText = await res.text();
        setError(`Error fetching data: ${errorText}`);
        return;
      }

      const data = await res.json();
      setPayRateHistory(data.length > 0 ? data : []);
    } catch (error) {
      setError("Unable to fetch pay rate history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPayRate = async (e) => {
    e.preventDefault();

    if (status === "authenticated" && session?.user?.employeeID) {
      const employeeID = session.user.employeeID;

      try {
        const res = await fetch("/api/employee", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            employeeID,
            payPeriod,
            payRate,
            payRateSchedule,
            effectiveDate,
          }),
        });

        if (!res.ok) {
          setError("Failed to submit pay rate. Please try again.");
          return;
        }

        // Fetch updated data after successful submission
        await fetchPayRateHistory();
      } catch (error) {
        setError("Error submitting pay rate. Please try again.");
      }
    } else {
      setError("Failed to retrieve employee information.");
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-3/4 p-6">
        <div className="flex justify-between">
          <div className="w-2/5">
            <h2 className="text-xl font-semibold mb-4">Set Pay Rate</h2>
            <form onSubmit={handleSubmitPayRate} className="space-y-6">
              <div>
                <label>Pay Period</label>
                <select
                  value={payPeriod}
                  onChange={(e) => setPayPeriod(e.target.value)}
                  className="text-black w-full border p-2 mb-4"
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>
              <div>
                <label>Pay Rate</label>
                <input
                  type="number"
                  value={payRate}
                  onChange={(e) => setPayRate(e.target.value)}
                  className="text-black w-full border p-2 mb-4"
                />
              </div>
              <div>
                <label>Pay Rate Schedule</label>
                <select
                  value={payRateSchedule}
                  onChange={(e) => setPayRateSchedule(e.target.value)}
                  className="text-black w-full border p-2 mb-4"
                >
                  <option value="Hourly">Hourly</option>
                  <option value="Daily">Daily</option>
                </select>
              </div>
              <div>
                <label>Effective Date</label>
                <input
                  type="date"
                  value={effectiveDate}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                  className="text-black w-full border p-2 mb-4"
                />
              </div>
              <Button type="submit" variant="primary">Submit Pay Rate</Button>
            </form>
          </div>

          <div className="w-3/5">
            <h2 className="text-xl font-semibold mb-4">Pay Rate History</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <table className="min-w-full border-collapse border border-gray-200 mt-6">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2">Status</th>
                    <th className="border border-gray-300 p-2">Pay Period</th>
                    <th className="border border-gray-300 p-2">Rate</th>
                    <th className="border border-gray-300 p-2">Schedule</th>
                    <th className="border border-gray-300 p-2">Effective Date</th>
                    <th className="border border-gray-300 p-2">Payroll</th>
                  </tr>
                </thead>
                <tbody>
                  {payRateHistory.length > 0 ? (
                    payRateHistory.map((entry) => (
                      <tr key={entry.id}>
                        <td className="border border-gray-300 p-2">{entry.status}</td>
                        <td className="border border-gray-300 p-2">{entry.payPeriod}</td>
                        <td className="border border-gray-300 p-2">{entry.payRate}</td>
                        <td className="border border-gray-300 p-2">{entry.payRateSchedule}</td>
                        <td className="border border-gray-300 p-2">{entry.effectiveDate ? new Date(entry.effectiveDate).toLocaleDateString() : 'N/A'}</td>
                        <td className="border border-gray-300 p-2">{entry.payroll ? entry.payroll.toFixed(2) : '-'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="border border-gray-300 p-2 text-center">
                        No pay rates found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}
