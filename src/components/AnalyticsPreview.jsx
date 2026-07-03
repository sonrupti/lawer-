export default function AnalyticsPreview() {
  return (
    <section className="py-20 bg-slate-100 text-center">
      <h2 className="text-3xl font-bold mb-10">
        Lawyer Analytics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto px-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-4xl font-bold text-blue-700">91%</h3>
          <p>Success Rate</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-4xl font-bold text-blue-700">420</h3>
          <p>Cases</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-4xl font-bold text-blue-700">15</h3>
          <p>Years Experience</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-4xl font-bold text-blue-700">4.9★</h3>
          <p>Rating</p>
        </div>
      </div>
    </section>
  );
}