import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export default function Employees() {
  const { data: session, status } = useSession();
  const [payRateHistory, setPayRateHistory] = useState([]);
  const [payPeriod, setPayPeriod] = useState("Daily");
  const [payRate, setPayRate] = useState(500);
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

        await fetchPayRateHistory();
      } catch (error) {
        setError("Error submitting pay rate. Please try again.");
      }
    } else {
      setError("Failed to retrieve employee information.");
    }
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100 dark:bg-gray-800">
      <div className="flex space-x-6 p-6 w-full max-w-6xl">
        {/* Set Pay Rate Card */}
        <div className="w-1/3 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md border border-gray-300">
          <h2 className="text-xl font-semibold mb-6">Set Pay Rate</h2>
          <form onSubmit={handleSubmitPayRate} className="space-y-4">
            <div>
              <label>Pay Rate</label>
              <input
                type="number"
                value={payRate}
                onChange={(e) => setPayRate(e.target.value)}
                className="w-full border p-2 rounded-lg text-black dark:text-white mb-4"
              />
            </div>
            <div>
              <label>Pay Rate Schedule</label>
              <select
                value={payRateSchedule}
                onChange={(e) => setPayRateSchedule(e.target.value)}
                className="w-full border p-2 rounded-lg text-black dark:text-white mb-4"
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
                className="w-full border p-2 rounded-lg text-black dark:text-white mb-4"
              />
            </div>
            <Button
              type="submit"
              className="w-full py-2 bg-gray-800 text-white rounded-lg dark:bg-white dark:text-gray-800 hover:bg-gray-700 dark:hover:bg-gray-300"
            >
              Submit Pay Rate
            </Button>
          </form>
        </div>

        {/* Pay Rate History Card */}
        <div className="w-2/3 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md border border-gray-300 overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Pay Rate History</h2>
            <div className="w-32">
              <select
                value={payPeriod}
                onChange={(e) => setPayPeriod(e.target.value)}
                className="w-full border p-2 rounded-lg text-black dark:text-white"
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300 rounded-lg text-black dark:text-white">
                <thead>
                  <tr>
                    {["Status", "Rate", "Schedule", "Effective Date", "Payroll"].map((header, index) => (
                      <th key={index} className="border border-gray-300 p-2">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payRateHistory.length > 0 ? (
                    payRateHistory.map((entry) => (
                      <tr key={entry.id}>
                        <td className="border border-gray-300 p-2">{entry.status}</td>
                        <td className="border border-gray-300 p-2">{entry.payRate}</td>
                        <td className="border border-gray-300 p-2">{entry.payRateSchedule}</td>
                        <td className="border border-gray-300 p-2">
                          {entry.effectiveDate ? new Date(entry.effectiveDate).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="border border-gray-300 p-2">{entry.payroll ? entry.payroll.toFixed(2) : '-'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="border border-gray-300 p-2 text-center">
                        No pay rates found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
}
