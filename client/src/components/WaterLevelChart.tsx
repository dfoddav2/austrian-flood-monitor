import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { RiverHistory } from './data/riverHistoryData';

interface WaterLevelChartProps {
  data: RiverHistory['yearlyData'];
  onClose: () => void;
}

const WaterLevelChart = ({ data, onClose }: WaterLevelChartProps) => {
  return (
    <div className="absolute bottom-16 left-4 bg-white p-4 rounded-lg shadow-lg w-96 z-[1000]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Historical Water Levels</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 12 }}
              interval={0}
              angle={-45}
              textAnchor="end"
            />
            <YAxis
              label={{
                value: 'Water Level (m)',
                angle: -90,
                position: 'insideLeft',
                style: { textAnchor: 'middle' }
              }}
            />
            <Tooltip />
            <Bar
              dataKey="level"
              fill="#3b82f6"
              name="Water Level"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WaterLevelChart;