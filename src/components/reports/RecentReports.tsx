import { useState } from 'react';
import { Eye, Download, Share2, X, FileText } from 'lucide-react';

interface ReportItem {
  name: string;
  type: string;
  plant: string;
  time: string;
  status: string;
  size: string;
}

const recentData: ReportItem[] = [
  {
    name: '运行日报_2025-05-15',
    type: '运行日报',
    plant: '第一污水处理厂',
    time: '2025-05-15 08:30',
    status: '已完成',
    size: '2.48MB',
  },
  {
    name: '能耗月报_2025-04',
    type: '能耗月报',
    plant: '第二污水处理厂',
    time: '2025-05-01 09:00',
    status: '已完成',
    size: '5.12MB',
  },
  {
    name: '水质月报_2025-04',
    type: '水质月报',
    plant: '第一污水处理厂',
    time: '2025-05-01 10:15',
    status: '已完成',
    size: '3.86MB',
  },
  {
    name: '异常事件报表_2025-04-20',
    type: '异常事件报表',
    plant: '第三污水处理厂',
    time: '2025-04-20 14:22',
    status: '已完成',
    size: '1.24MB',
  },
  {
    name: 'AI优化成效报告_2025-Q1',
    type: 'AI优化成效报告',
    plant: '第一污水处理厂',
    time: '2025-04-10 11:00',
    status: '已完成',
    size: '8.56MB',
  },
  {
    name: '自定义报表_2025-04-15',
    type: '自定义报表',
    plant: '第四污水处理厂',
    time: '2025-04-15 16:45',
    status: '已完成',
    size: '4.32MB',
  },
  {
    name: '运行日报_2025-05-14',
    type: '运行日报',
    plant: '第一污水处理厂',
    time: '2025-05-14 08:30',
    status: '已完成',
    size: '2.41MB',
  },
  {
    name: '运行日报_2025-05-13',
    type: '运行日报',
    plant: '第二污水处理厂',
    time: '2025-05-13 08:30',
    status: '已完成',
    size: '2.55MB',
  },
];

function getStatusColor(status: string): string {
  switch (status) {
    case '已完成':
      return 'bg-status-normal';
    case '生成中':
      return 'bg-status-warning';
    case '失败':
      return 'bg-status-danger';
    default:
      return 'bg-status-info';
  }
}

function DetailPanel({
  report,
  onClose,
}: {
  report: ReportItem;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="relative w-[420px] max-w-[90vw] rounded-lg border border-border-subtle bg-bg-panel shadow-glow-cyan p-5">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded hover:bg-white/10 transition-colors text-text-tertiary hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-bg-primary border border-border-subtle flex items-center justify-center">
            <FileText className="w-5 h-5 text-accent-cyan" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">{report.name}</h3>
            <span className="text-xs text-text-tertiary">{report.type}</span>
          </div>
        </div>

        {/* Detail fields */}
        <div className="space-y-3 mb-5">
          <div className="flex justify-between py-1.5 border-b border-border-subtle">
            <span className="text-xs text-text-tertiary">水厂</span>
            <span className="text-xs text-text-secondary">{report.plant}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-border-subtle">
            <span className="text-xs text-text-tertiary">生成时间</span>
            <span className="text-xs text-text-secondary font-mono-data">{report.time}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-border-subtle">
            <span className="text-xs text-text-tertiary">状态</span>
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${getStatusColor(report.status)}`} />
              <span className="text-xs text-status-normal">{report.status}</span>
            </div>
          </div>
          <div className="flex justify-between py-1.5 border-b border-border-subtle">
            <span className="text-xs text-text-tertiary">文件大小</span>
            <span className="text-xs text-text-secondary font-mono-data">{report.size}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-3">
          <button className="flex items-center gap-1.5 px-4 py-2 rounded bg-bg-primary border border-border-subtle text-xs text-text-secondary hover:text-accent-cyan hover:border-accent-cyan transition-colors">
            <Eye className="w-3.5 h-3.5" />
            预览
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded bg-accent-cyan text-xs text-bg-primary font-semibold hover:bg-accent-cyan-dim transition-colors">
            <Download className="w-3.5 h-3.5" />
            下载
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded bg-bg-primary border border-border-subtle text-xs text-text-secondary hover:text-accent-cyan hover:border-accent-cyan transition-colors">
            <Share2 className="w-3.5 h-3.5" />
            分享
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RecentReports() {
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);

  return (
    <div className="flex flex-col gap-2 h-full">
      {/* Header row */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="panel-title">最近生成报表</div>
        <button className="text-xs text-accent-cyan hover:text-accent-cyan-dim transition-colors flex items-center gap-0.5 cursor-pointer">
          查看全部
          <span className="text-accent-cyan">&gt;</span>
        </button>
      </div>

      {/* Scrollable table container */}
      <div className="overflow-auto custom-scrollbar rounded border border-border-subtle flex-1 min-h-0">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="bg-bg-panel">
              <th className="text-left py-1.5 px-3 text-xs text-text-tertiary font-medium">报表名称</th>
              <th className="text-left py-1.5 px-3 text-xs text-text-tertiary font-medium">报表类型</th>
              <th className="text-left py-1.5 px-3 text-xs text-text-tertiary font-medium">水厂</th>
              <th className="text-left py-1.5 px-3 text-xs text-text-tertiary font-medium">生成时间</th>
              <th className="text-left py-1.5 px-3 text-xs text-text-tertiary font-medium">状态</th>
              <th className="text-left py-1.5 px-3 text-xs text-text-tertiary font-medium">文件大小</th>
              <th className="text-center py-1.5 px-3 text-xs text-text-tertiary font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {recentData.map((row, idx) => (
              <tr
                key={idx}
                className="border-t border-border-subtle bg-transparent hover:bg-bg-panel-hover transition-colors"
              >
                <td className="py-1.5 px-3 text-xs text-text-primary">{row.name}</td>
                <td className="py-1.5 px-3 text-xs text-text-secondary">{row.type}</td>
                <td className="py-1.5 px-3 text-xs text-text-secondary">{row.plant}</td>
                <td className="py-1.5 px-3 text-xs text-text-tertiary font-mono-data">{row.time}</td>
                <td className="py-1.5 px-3">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${getStatusColor(row.status)}`} />
                    <span className="text-xs text-status-normal">{row.status}</span>
                  </div>
                </td>
                <td className="py-1.5 px-3 text-xs text-text-tertiary font-mono-data">{row.size}</td>
                <td className="py-1.5 px-3">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      className="p-1 rounded hover:bg-white/5 transition-colors text-text-tertiary hover:text-accent-cyan"
                      title="预览"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      className="p-1 rounded hover:bg-white/5 transition-colors text-text-tertiary hover:text-accent-cyan"
                      title="下载"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      className="p-1 rounded hover:bg-white/5 transition-colors text-text-tertiary hover:text-accent-cyan"
                      title="分享"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setSelectedReport(row)}
                      className="ml-1 px-2 py-0.5 rounded text-[10px] bg-bg-primary border border-border-subtle text-text-tertiary hover:text-accent-cyan hover:border-accent-cyan transition-colors"
                    >
                      查看详情
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail popup */}
      {selectedReport && (
        <DetailPanel
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
}
