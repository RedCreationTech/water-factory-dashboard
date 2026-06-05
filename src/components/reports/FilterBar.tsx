import { useState } from 'react';
import {
  Calendar,
  ChevronDown,
  FileText,
  Table,
  Presentation,
} from 'lucide-react';

export default function FilterBar() {
  const [plant, setPlant] = useState('第一污水处理厂');
  const [reportType, setReportType] = useState('全部');

  const handleExport = (format: string) => {
    alert(`正在导出${format}...`);
  };

  return (
    <div className="flex items-center justify-between gap-4 px-1">
      {/* Left: Filters */}
      <div className="flex items-center gap-4">
        {/* Date range */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-border-primary bg-bg-panel text-sm">
          <Calendar className="w-4 h-4 text-text-tertiary" />
          <span className="text-text-secondary">2025-05-01</span>
          <span className="text-text-tertiary">~</span>
          <span className="text-text-secondary">2025-05-15</span>
        </div>

        {/* Plant selector */}
        <div className="relative">
          <select
            value={plant}
            onChange={(e) => setPlant(e.target.value)}
            className="appearance-none pl-3 pr-8 py-1.5 rounded border border-border-primary bg-bg-panel text-sm text-text-secondary cursor-pointer focus:outline-none focus:border-border-glow"
          >
            <option>第一污水处理厂</option>
            <option>第二污水处理厂</option>
            <option>第三污水处理厂</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
        </div>

        {/* Report type selector */}
        <div className="relative">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="appearance-none pl-3 pr-8 py-1.5 rounded border border-border-primary bg-bg-panel text-sm text-text-secondary cursor-pointer focus:outline-none focus:border-border-glow"
          >
            <option>全部</option>
            <option>运行日报</option>
            <option>能耗月报</option>
            <option>水质月报</option>
            <option>异常事件报表</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
        </div>
      </div>

      {/* Right: Export buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleExport('PDF')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-border-primary bg-bg-panel text-sm text-text-secondary hover:border-border-glow hover:text-text-primary transition-all"
        >
          <FileText className="w-3.5 h-3.5" />
          导出PDF
        </button>
        <button
          onClick={() => handleExport('Excel')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-border-primary bg-bg-panel text-sm text-text-secondary hover:border-border-glow hover:text-text-primary transition-all"
        >
          <Table className="w-3.5 h-3.5" />
          导出Excel
        </button>
        <button
          onClick={() => handleExport('PPT')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-border-primary bg-bg-panel text-sm text-text-secondary hover:border-border-glow hover:text-text-primary transition-all"
        >
          <Presentation className="w-3.5 h-3.5" />
          导出PPT
        </button>
      </div>
    </div>
  );
}
