const areas = [
  "Civil",
  "Criminal",
  "Family",
  "Corporate",
  "Property",
  "Tax",
  "Consumer",
  "Labour",
];

export default function PracticeAreas() {
  return (
    <section className="py-16 text-center bg-white">
      <h2 className="text-3xl font-bold mb-8">
        Practice Areas
      </h2>

      <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
        {areas.map((area) => (
          <button
            key={area}
            className="px-5 py-3 bg-blue-100 text-blue-800 rounded-xl hover:bg-blue-600 hover:text-white transition"
          >
            {area}
          </button>
        ))}
      </div>
    </section>
  );
}