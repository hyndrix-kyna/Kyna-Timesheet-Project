import dynamic from 'next/dynamic';
import { useState } from 'react';
import useFadeInOnScroll from "../hooks/useFadeInOnScroll";

// Dynamically import the Bar and Line components from react-chartjs-2, disabling SSR
const Bar = dynamic(() => import("react-chartjs-2").then((mod) => mod.Bar), { ssr: false });
const Line = dynamic(() => import("react-chartjs-2").then((mod) => mod.Line), { ssr: false });

// Import and register necessary Chart.js components
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

export default function FeaturesSection() {
  const ref = useFadeInOnScroll();
  const [sampleData] = useState({
    timesheet: [8, 7.5, 8, 6, 7], // Sample hours worked over a week
    payroll: [4000, 3500, 4000, 3000, 3500], // Sample payroll in currency
  });

  const barData = {
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    datasets: [
      {
        label: "Hours Worked",
        data: sampleData.timesheet,
        backgroundColor: "rgba(37, 99, 235, 0.7)", // Tailwind blue color
      },
    ],
  };
  
  const lineData = {
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    datasets: [
      {
        label: "Payroll",
        data: sampleData.payroll,
        borderColor: "rgb(107, 33, 168)", // Tailwind purple color
        backgroundColor: "rgba(107, 33, 168, 0.1)", // Fill background for visibility
        fill: true,
      },
    ],
  };  

  return (
    <section ref={ref} className="fade-in container mx-auto py-10 text-center">
      <h2 className="text-3xl font-bold mb-4">Project Features</h2>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2">Hours Worked (Weekly)</h3>
          <Bar data={barData} />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2">Payroll (Weekly)</h3>
          <Line data={lineData} />
        </div>
      </div>
    </section>
  );
}
