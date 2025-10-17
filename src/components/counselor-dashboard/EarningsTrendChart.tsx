import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMemo, useState } from 'react';
import type { Transaction } from '@/types/earnings';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ChartData {
  name: string;
  plus: number;
  pro: number;
  elite: number;
}

interface EarningsTrendChartProps {
  transactions: Transaction[];
  timeframe: 'yearly' | 'monthly';
}

const processYearlyData = (transactions: Transaction[], year: number): ChartData[] => {
  const monthlyData: { [key: string]: { plus: number; pro: number; elite: number } } = {};
  transactions.forEach(tx => {
    const txDate = new Date(tx.timestamp);
    if (tx.type === 'credit' && tx.subscriptionPlan && txDate.getFullYear() === year) {
      const month = txDate.toLocaleString('default', { month: 'short' });
      if (!monthlyData[month]) monthlyData[month] = { plus: 0, pro: 0, elite: 0 };
      if (tx.subscriptionPlan === 'plus') monthlyData[month].plus += tx.amount;
      else if (tx.subscriptionPlan === 'pro') monthlyData[month].pro += tx.amount;
      else if (tx.subscriptionPlan === 'elite') monthlyData[month].elite += tx.amount;
    }
  });
  const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return monthOrder.map(month => ({
    name: month,
    plus: monthlyData[month]?.plus || 0,
    pro: monthlyData[month]?.pro || 0,
    elite: monthlyData[month]?.elite || 0,
  }));
};

const processWeeklyData = (transactions: Transaction[], month: Date): ChartData[] => {
  const weekBins = {
    '1-7': { name: '1-7', plus: 0, pro: 0, elite: 0 },
    '8-14': { name: '8-14', plus: 0, pro: 0, elite: 0 },
    '15-21': { name: '15-21', plus: 0, pro: 0, elite: 0 },
    '22-28': { name: '22-28', plus: 0, pro: 0, elite: 0 },
    '29-31': { name: '29-31', plus: 0, pro: 0, elite: 0 },
  };

  const filteredTx = transactions.filter(tx => {
    const txDate = new Date(tx.timestamp);
    return txDate.getFullYear() === month.getFullYear() && txDate.getMonth() === month.getMonth();
  });

  filteredTx.forEach(tx => {
    if (tx.type === 'credit' && tx.subscriptionPlan) {
      const dayOfMonth = new Date(tx.timestamp).getDate();
      let bin: keyof typeof weekBins | null = null;
      if (dayOfMonth <= 7) bin = '1-7';
      else if (dayOfMonth <= 14) bin = '8-14';
      else if (dayOfMonth <= 21) bin = '15-21';
      else if (dayOfMonth <= 28) bin = '22-28';
      else bin = '29-31';
      
      if (bin) {
        if (tx.subscriptionPlan === 'plus') weekBins[bin].plus += tx.amount;
        else if (tx.subscriptionPlan === 'pro') weekBins[bin].pro += tx.amount;
        else if (tx.subscriptionPlan === 'elite') weekBins[bin].elite += tx.amount;
      }
    }
  });

  return Object.values(weekBins);
};


const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const title = payload[0].payload.name; 
    const plus = payload.find((p: any) => p.dataKey === 'plus')?.value || 0;
    const pro = payload.find((p: any) => p.dataKey === 'pro')?.value || 0;
    const elite = payload.find((p: any) => p.dataKey === 'elite')?.value || 0;

    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-800">{title}</p>
        <div className="mt-1 text-sm space-y-1">
          <p className="text-gray-600">Plus: <span className="font-medium text-[#F6CF7D]">₹{plus.toLocaleString()}</span></p>
          <p className="text-gray-600">Pro: <span className="font-medium text-[#978FED]">₹{pro.toLocaleString()}</span></p>
          <p className="text-gray-600">Elite: <span className="font-medium text-[#EE89DF]">₹{elite.toLocaleString()}</span></p>
        </div>
      </div>
    );
  }
  return null;
};

const RotatedXAxisTick = (props: any) => {
  const { x, y, payload } = props;
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={5} textAnchor="end" fill="rgba(0, 0, 26, 0.4)" transform="rotate(-90)" fontFamily="Montserrat" fontSize={14}>
        {payload.value}
      </text>
    </g>
  );
};

export default function EarningsTrendChart({ transactions, timeframe }: EarningsTrendChartProps) {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear()); 
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const chartData = useMemo(() => {
    if (timeframe === 'yearly') {
      return processYearlyData(transactions, currentYear);
    }
    return processWeeklyData(transactions, currentMonth);
  }, [transactions, timeframe, currentMonth, currentYear]);

  const maxEarning = Math.max(...chartData.map(d => d.plus + d.pro + d.elite), 0);
  const yAxisDomainMax = Math.ceil(maxEarning / 500) * 500 || 500;

  const goToNextYear = () => setCurrentYear(prev => prev + 1);
  const goToPrevYear = () => setCurrentYear(prev => prev - 1);
  const goToNextMonth = () => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  const goToPrevMonth = () => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));

  return (
     <div className="w-full h-[400px] p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#F6CF7D]"></span>Plus</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#978FED]"></span>Pro</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#EE89DF]"></span>Elite</div>
        </div>
        
        {timeframe === 'yearly' ? (
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-md p-1">
            <button onClick={goToPrevYear} className="p-1 hover:bg-gray-100 rounded"><ChevronLeft size={16} /></button>
            <span className="text-sm font-medium">{currentYear}</span>
            <button onClick={goToNextYear} className="p-1 hover:bg-gray-100 rounded"><ChevronRight size={16} /></button>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-md p-1">
            <button onClick={goToPrevMonth} className="p-1 hover:bg-gray-100 rounded"><ChevronLeft size={16} /></button>
            <span className="text-sm font-medium">{currentMonth.toLocaleString('default', { month: 'short' })}'{currentMonth.getFullYear().toString().slice(-2)}</span>
            <button onClick={goToNextMonth} className="p-1 hover:bg-gray-100 rounded"><ChevronRight size={16} /></button>
          </div>
        )}
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0, 0, 26, 0.05)" />
          <XAxis 
            dataKey="name" 
            axisLine={{ stroke: 'rgba(0, 0, 26, 0.15)', strokeWidth: 0.75 }}
            tickLine={{ stroke: 'rgba(0, 0, 26, 0.4)' }}
            interval={0}
            tick={timeframe === 'yearly' ? <RotatedXAxisTick /> : { fontFamily: 'Montserrat', fontSize: 14, fill: 'rgba(0, 0, 26, 0.4)' }}
            height={timeframe === 'yearly' ? 60 : 30}
          />
          <YAxis 
            axisLine={{ stroke: 'rgba(0, 0, 26, 0.15)', strokeWidth: 0.75 }}
            tickLine={{ stroke: 'rgba(0, 0, 26, 0.4)' }}
            tick={{ fontFamily: 'Montserrat', fontSize: 13, fill: 'rgba(0, 0, 26, 0.4)'}}
            domain={[0, yAxisDomainMax]}
            ticks={[0, yAxisDomainMax * 0.25, yAxisDomainMax * 0.5, yAxisDomainMax * 0.75, yAxisDomainMax].map(t => Math.round(t))}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(238, 238, 238, 0.5)' }} />
          <Bar dataKey="plus" stackId="a" fill="#F6CF7D" barSize={24} />
          <Bar dataKey="pro" stackId="a" fill="#978FED" barSize={24} />
          <Bar dataKey="elite" stackId="a" fill="#EE89DF" barSize={24} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}