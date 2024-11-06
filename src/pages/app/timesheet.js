// /src/pages/app/timesheet.js
import { useEffect, useState } from "react";
import { useSession, getSession } from "next-auth/react";

export default function Timesheet() {
  const [status, setStatus] = useState("notStarted"); // Track the clock-in status
  const { data: session } = useSession();
  const [timesheet, setTimesheet] = useState(null); // For current session
  const [allTimesheets, setAllTimesheets] = useState([]); // Initialize as an empty array
  const [elapsedTime, setElapsedTime] = useState(0); // Elapsed time in seconds

  useEffect(() => {
    if (session?.user?.id) {
      fetchTimesheet(session.user.id); // Fetch timesheet data on page load
    }
  }, [session]);

  useEffect(() => {
    let interval = null;
    if (status === "clockedIn" && timesheet?.timeIn && !timesheet?.timeOut) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((new Date() - new Date(timesheet.timeIn)) / 1000));
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [status, timesheet]);

  const fetchTimesheet = async (userId) => {
    const res = await fetch(`/api/timesheet/${userId}`, {
      method: "GET",
    });

    const data = await res.json();
    setTimesheet(data.current || null); // Current active timesheet
    setAllTimesheets(data.all || []); // All records
    updateStatus(data.current); // Set status based on current timesheet state
  };

  const updateStatus = (current) => {
    if (!current) {
      setStatus("notStarted");
    } else if (current.timeOut) {
      setStatus("clockedOut");
    } else if (current.breakStart && !current.breakEnd) {
      setStatus("onBreak");
    } else {
      setStatus("clockedIn");
    }
  };

  const handleTimeAction = async (action) => {
    if (!session?.user?.id) return;

    const res = await fetch(`/api/timesheet/${session.user.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });

    const data = await res.json();
    if (res.ok) {
      setTimesheet(data); // Update the current timesheet
      updateStatus(data); // Update status based on the new state

      await fetchTimesheet(session.user.id);
    } else {
      alert(data.error || "Failed to update timesheet");
    }
  };

  const formatTimeSpan = (timeIn, timeOut) => {
    const options = { hour: "numeric", minute: "numeric", second: "numeric", hour12: true };
    const timeInFormatted = new Date(timeIn).toLocaleTimeString("en-SG", options);
    const timeOutFormatted = timeOut ? new Date(timeOut).toLocaleTimeString("en-SG", options) : "In Progress";
    return `${timeInFormatted} - ${timeOutFormatted}`;
  };

  const formatDuration = (seconds) => {
    seconds = Math.floor(seconds); 
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Timesheet</h1>

      {/* Display Timesheet Records in Descending Order */}
      <div className="overflow-y-auto" style={{ maxHeight: "400px" }}>
        <table className="min-w-full border-collapse border border-gray-200 mt-6">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Employee Name</th>
              <th className="border border-gray-300 p-2">Date</th>
              <th className="border border-gray-300 p-2">Duration</th>
              <th className="border border-gray-300 p-2">Time Span</th>
            </tr>
          </thead>
          <tbody>
            {allTimesheets.length > 0 ? (
              allTimesheets
                .slice()
                .sort((a, b) => new Date(b.timeIn) - new Date(a.timeIn))
                .map((entry) => (
                  <tr key={entry.id}>
                    <td className="border border-gray-300 p-2">{`${session?.user?.firstName} ${session?.user?.lastName}`}</td>
                    <td className="border border-gray-300 p-2">
                      {new Date(entry.timeIn).toLocaleDateString("en-SG", {
                      weekday: 'long',
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                      })}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {entry.timeOut
                        ? formatDuration((new Date(entry.timeOut) - new Date(entry.timeIn)) / 1000)
                        : formatDuration(elapsedTime)}
                    </td>
                    <td className="border border-gray-300 p-2">{formatTimeSpan(entry.timeIn, entry.timeOut)}</td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="4" className="border border-gray-300 p-2 text-center">
                  No timesheets found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Clock In / Clock Out Buttons */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={() => handleTimeAction("timeIn")}
          className={`py-2 px-4 rounded ${status === "clockedIn" || status === "clockedOut" ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 text-white"}`}
          disabled={status === "clockedIn" || status === "clockedOut"}
        >
          Time In
        </button>

        <button
          onClick={() => handleTimeAction(status === "onBreak" ? "breakEnd" : "breakStart")}
          className="bg-yellow-500 text-white py-2 px-4 rounded"
          disabled={status === "notStarted" || status === "clockedOut"}
        >
          {status === "onBreak" ? "End Break" : "Start Break"}
        </button>

        <button
          onClick={() => handleTimeAction("timeOut")}
          className="bg-red-500 text-white py-2 px-4 rounded"
          disabled={status !== "clockedIn"}
        >
          Time Out
        </button>
      </div>

      {/* Message when user has clocked out */}
      {status === "clockedOut" && <p className="mt-4 text-red-500">You have clocked out for today.</p>}
    </div>
  );
}

// Fetch session and timesheet data on the server side
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
