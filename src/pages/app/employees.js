import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"; // Shadcn UI component
import { useSession } from "next-auth/react"; // Import useSession

export default function Employees() {
  const { data: session, status } = useSession(); // Use useSession to get session
  const [payRateHistory, setPayRateHistory] = useState([]);
  const [payPeriod, setPayPeriod] = useState("Daily");
  const [payRate, setPayRate] = useState(0);
  const [payRateSchedule, setPayRateSchedule] = useState("Hourly");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.employeeID) {
      const fetchPayRateHistory = async () => {
        try {
          const res = await fetch(`/api/employee/${session.user.employeeID}`);
          const data = await res.json();
          setPayRateHistory(data);
        } catch (error) {
          console.error("Failed to fetch pay rate history:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchPayRateHistory();
    } else if (status === "unauthenticated") {
      setLoading(false); // Stop loading if unauthenticated
    }
  }, [session, status]);

  const handleSubmitPayRate = async (e) => {
    e.preventDefault();

    if (status === "authenticated" && session?.user?.employeeID) {
      const employeeID = session.user.employeeID; // Get employeeID from session

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

        if (res.ok) {
          alert("Pay rate submitted successfully!");
          const updatedHistory = await res.json();
          setPayRateHistory([...payRateHistory, updatedHistory]);
        } else {
          alert("Failed to submit pay rate.");
        }
      } catch (error) {
        console.error("Error submitting pay rate:", error);
      }
    } else {
      alert("Failed to retrieve employee information.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex h-screen">
      {/* Main content */}
      <div className="w-3/4 p-6">
        <div className="flex justify-between">
          {/* Pay Rate Form */}
          <div className="w-2/5">
            <h2 className="text-xl font-semibold mb-4">Set Pay Rate</h2>
            <form onSubmit={handleSubmitPayRate} className="space-y-6">
              <div>
                <label>Pay Period</label>
                <select
                  value={payPeriod}
                  onChange={(e) => setPayPeriod(e.target.value)}
                  className="w-full border p-2 mb-4"
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
                  className="w-full border p-2 mb-4"
                />
              </div>
              <div>
                <label>Pay Rate Schedule</label>
                <select
                  value={payRateSchedule}
                  onChange={(e) => setPayRateSchedule(e.target.value)}
                  className="w-full border p-2 mb-4"
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
                  className="w-full border p-2 mb-4"
                />
              </div>
              <Button type="submit" variant="primary">Submit Pay Rate</Button>
            </form>
          </div>

          {/* Pay Rate History */}
          <div className="w-3/5">
            <h2 className="text-xl font-semibold mb-4">Pay Rate History</h2>
            {payRateHistory.length === 0 ? (
              <p>No pay rate history found.</p>
            ) : (
              <table className="min-w-full border-collapse border border-gray-200 mt-6">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2">Status</th>
                    <th className="border border-gray-300 p-2">Pay Period</th>
                    <th className="border border-gray-300 p-2">Rate</th>
                    <th className="border border-gray-300 p-2">Time</th>
                    <th className="border border-gray-300 p-2">Start Date</th>
                    <th className="border border-gray-300 p-2">Payroll</th>
                  </tr>
                </thead>
                <tbody>
                  {payRateHistory.map((entry) => (
                    <tr key={entry.id}>
                      <td className="border border-gray-300 p-2">{entry.status}</td>
                      <td className="border border-gray-300 p-2">{entry.payPeriod}</td>
                      <td className="border border-gray-300 p-2">{entry.rate}</td>
                      <td className="border border-gray-300 p-2">{entry.time}</td>
                      <td className="border border-gray-300 p-2">{entry.startDate}</td>
                      <td className="border border-gray-300 p-2">{entry.payroll}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
