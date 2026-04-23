export default function InsightCard() {
  return (
    <div className="bg-yellow-50 border rounded-2xl p-5 shadow-sm">

      <h2 className="font-semibold text-green-700 mb-2">
        🌞 Today's Garden Insight
      </h2>

      <p className="text-sm text-gray-700">
        High temperature detected (34°C).  
        Water your plants in the evening and avoid fertilizing today.
      </p>

    </div>
  );
}