export default function TasksCard() {
  return (
    <div className="bg-white border rounded-2xl p-5 shadow-sm">

      <h2 className="font-semibold mb-3">📋 Today's Tasks</h2>

      <div className="space-y-3">

        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
          <div>
            <p className="font-medium">Water Tomato</p>
            <p className="text-xs text-gray-500">Evening</p>
          </div>
          <span className="text-green-600 text-xs">Due Today</span>
        </div>

        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
          <div>
            <p className="font-medium">Fertilize Spinach</p>
            <p className="text-xs text-gray-500">After 2 days</p>
          </div>
          <span className="text-yellow-600 text-xs">Upcoming</span>
        </div>

      </div>

    </div>
  );
}