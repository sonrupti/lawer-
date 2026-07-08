export default function LawyerCard({ lawyer }) {
  return (
    <div className="card">
      <h3>{lawyer.name}</h3>

      <p>{lawyer.practice}</p>

      <p>{lawyer.cases} cases</p>

      <p>{lawyer.winRate}% success</p>
    </div>
  );
}