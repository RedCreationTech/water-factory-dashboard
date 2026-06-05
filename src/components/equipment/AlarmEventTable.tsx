import DataTable from '@/components/DataTable';

interface AlarmRow {
  [key: string]: unknown;
  key: string;
  time: string;
  level: '严重' | '重要' | '一般';
  device: string;
  content: string;
  location: string;
  status: '未确认' | '已确认';
}

const alarmData: AlarmRow[] = [
  {
    key: '1',
    time: '2024-01-15 09:42:18',
    level: '严重',
    device: '鼓风机#B-03',
    content: '轴承温度超过告警阈值(85°C)',
    location: '鼓风机房 1#',
    status: '未确认',
  },
  {
    key: '2',
    time: '2024-01-15 09:28:05',
    level: '重要',
    device: '回流泵#R-07',
    content: '电机电流异常波动(48.2A)',
    location: '泵房 A区',
    status: '未确认',
  },
  {
    key: '3',
    time: '2024-01-15 08:56:32',
    level: '一般',
    device: '在线仪表#PH-12',
    content: 'pH传感器信号弱，需校准',
    location: '生化池出口',
    status: '已确认',
  },
  {
    key: '4',
    time: '2024-01-15 08:15:47',
    level: '重要',
    device: '提升泵#P-02',
    content: '振动值超过告警阈值(5.2mm/s)',
    location: '进水泵房',
    status: '未确认',
  },
  {
    key: '5',
    time: '2024-01-15 07:38:21',
    level: '一般',
    device: '加药泵#D-04',
    content: '加药管路压力偏低(0.12MPa)',
    location: '加药间 B区',
    status: '已确认',
  },
];

const columns = [
  {
    key: 'time',
    title: '时间',
    dataIndex: 'time',
    width: '140px',
  },
  {
    key: 'level',
    title: '级别',
    width: '60px',
    render: (row: AlarmRow) => {
      const colorMap: Record<string, string> = {
        '严重': '#ff4444',
        '重要': '#ffcc00',
        '一般': '#00aaff',
      };
      return (
        <div className="flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{
              backgroundColor: colorMap[row.level],
              boxShadow: `0 0 4px ${colorMap[row.level]}`,
            }}
          />
          <span className="text-[11px]" style={{ color: colorMap[row.level] }}>
            {row.level}
          </span>
        </div>
      );
    },
  },
  {
    key: 'device',
    title: '设备',
    dataIndex: 'device',
    width: '100px',
  },
  {
    key: 'content',
    title: '告警内容',
    dataIndex: 'content',
  },
  {
    key: 'location',
    title: '位置',
    dataIndex: 'location',
    width: '100px',
  },
  {
    key: 'status',
    title: '状态',
    width: '60px',
    render: (row: AlarmRow) => (
      <span
        className="text-[11px]"
        style={{
          color: row.status === '未确认' ? '#ff4444' : '#00ff88',
        }}
      >
        {row.status}
      </span>
    ),
  },
];

export default function AlarmEventTable() {
  return (
    <div className="w-full h-full overflow-hidden flex flex-col">
      <DataTable
        columns={columns as any}
        data={alarmData as any}
        maxHeight="100%"
      />
    </div>
  );
}
