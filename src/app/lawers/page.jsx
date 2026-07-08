import LawyerCard from "@/components/LawyerCard";

const lawyers = [
  {
    id:1,
    name:"A Mishra",
    practice:"Property",
    cases:312,
    winRate:82
  }
];

export default function Lawyers() {
  return (
    <>
      <h1>Lawyers</h1>

      {lawyers.map(lawyer=>(
        <LawyerCard
          key={lawyer.id}
          lawyer={lawyer}
        />
      ))}
    </>
  );
}