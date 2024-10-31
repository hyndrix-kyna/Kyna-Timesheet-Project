// IntroductionSection.js
export default function IntroductionSection() {
  return (
    <section className="container mx-auto text-center py-20 text-foreground" style={{ marginTop: '10vh', marginBottom: '5vh' }}>
      <h1 className="text-4xl font-bold mb-4">Welcome to the Timesheet Project</h1>
      <p className="text-lg mb-6">
        Where companies can streamline employee management with real-time timesheets, payroll calculation, and comprehensive analytics.
      </p>
      <p className="text-lg mb-6">
        Track employee work hours, manage pay rates, generate payroll reports, and access data-driven insights effortlessly.
      </p>
    </section>
  );
}
