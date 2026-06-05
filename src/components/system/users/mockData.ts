export interface User {
  key: string
  username: string
  name: string
  role: string
  plant: string
  department: string
  phone: string
  email: string
  lastLogin: string
  loginIp: string
  status: 'online' | 'offline'
  enabled: boolean
  avatar?: string
}

export interface OperationRecord {
  key: string
  time: string
  operator: string
  type: string
  target: string
  content: string
  result: 'success' | 'fail'
}

export const roleOptions = ['全部角色', '系统管理员', '厂长', '工艺工程师', '操作员', '巡检员', '化验员']

export const plantOptions = ['全部水厂', '城北污水处理厂', '城南污水处理厂', '城东污水处理厂', '城西污水处理厂']

export const statusOptions = ['全部状态', '在线', '离线']

export const mockUsers: User[] = [
  {
    key: '1',
    username: 'admin',
    name: '系统管理员',
    role: '系统管理员',
    plant: '城北污水处理厂',
    department: '信息技术部',
    phone: '13800138000',
    email: 'admin@wwtp.com',
    lastLogin: '2024-01-15 09:23:15',
    loginIp: '192.168.1.100',
    status: 'online',
    enabled: true,
  },
  {
    key: '2',
    username: 'zhangwei',
    name: '张伟',
    role: '厂长',
    plant: '城北污水处理厂',
    department: '运营管理部',
    phone: '13900139001',
    email: 'zhangwei@wwtp.com',
    lastLogin: '2024-01-15 08:45:32',
    loginIp: '192.168.1.101',
    status: 'online',
    enabled: true,
  },
  {
    key: '3',
    username: 'lisi',
    name: '李四',
    role: '工艺工程师',
    plant: '城南污水处理厂',
    department: '工艺技术部',
    phone: '13700137002',
    email: 'lisi@wwtp.com',
    lastLogin: '2024-01-15 07:12:08',
    loginIp: '192.168.1.102',
    status: 'online',
    enabled: true,
  },
  {
    key: '4',
    username: 'wangwu',
    name: '王五',
    role: '操作员',
    plant: '城东污水处理厂',
    department: '运行班组A',
    phone: '13600136003',
    email: 'wangwu@wwtp.com',
    lastLogin: '2024-01-14 22:36:50',
    loginIp: '192.168.1.103',
    status: 'offline',
    enabled: true,
  },
  {
    key: '5',
    username: 'zhaoliu',
    name: '赵六',
    role: '巡检员',
    plant: '城西污水处理厂',
    department: '设备维护部',
    phone: '13500135004',
    email: 'zhaoliu@wwtp.com',
    lastLogin: '2024-01-14 18:15:22',
    loginIp: '192.168.1.104',
    status: 'offline',
    enabled: true,
  },
  {
    key: '6',
    username: 'qianqi',
    name: '钱七',
    role: '化验员',
    plant: '城北污水处理厂',
    department: '化验室',
    phone: '13400134005',
    email: 'qianqi@wwtp.com',
    lastLogin: '2024-01-14 16:48:37',
    loginIp: '192.168.1.105',
    status: 'online',
    enabled: true,
  },
  {
    key: '7',
    username: 'sunba',
    name: '孙八',
    role: '操作员',
    plant: '城南污水处理厂',
    department: '运行班组B',
    phone: '13300133006',
    email: 'sunba@wwtp.com',
    lastLogin: '2024-01-13 20:05:14',
    loginIp: '192.168.1.106',
    status: 'offline',
    enabled: false,
  },
  {
    key: '8',
    username: 'zhoujiu',
    name: '周九',
    role: '工艺工程师',
    plant: '城东污水处理厂',
    department: '工艺技术部',
    phone: '13200132007',
    email: 'zhoujiu@wwtp.com',
    lastLogin: '2024-01-13 14:22:09',
    loginIp: '192.168.1.107',
    status: 'offline',
    enabled: true,
  },
]

export const operationRecords: OperationRecord[] = [
  {
    key: '1',
    time: '2024-01-15 09:30:22',
    operator: 'admin',
    type: '用户管理',
    target: 'sunba',
    content: '禁用用户账号',
    result: 'success',
  },
  {
    key: '2',
    time: '2024-01-15 08:45:10',
    operator: 'admin',
    type: '用户管理',
    target: 'wangwu',
    content: '重置用户密码',
    result: 'success',
  },
  {
    key: '3',
    time: '2024-01-14 17:20:45',
    operator: 'zhangwei',
    type: '权限管理',
    target: 'lisi',
    content: '修改工艺工程师数据权限为"全部数据"',
    result: 'success',
  },
]

export const detailPermissions = {
  dataPermission: '全部数据',
  funcPermission: 26,
  menuPermission: 128,
}

export const detailPermissionsForUser = (user: User) => {
  if (user.role === '系统管理员') {
    return { dataPermission: '全部数据', funcPermission: 26, menuPermission: 128 }
  }
  if (user.role === '厂长') {
    return { dataPermission: '全部数据', funcPermission: 20, menuPermission: 95 }
  }
  if (user.role === '工艺工程师') {
    return { dataPermission: '本厂数据', funcPermission: 15, menuPermission: 72 }
  }
  if (user.role === '操作员') {
    return { dataPermission: '本厂数据', funcPermission: 8, menuPermission: 45 }
  }
  if (user.role === '巡检员') {
    return { dataPermission: '本厂数据', funcPermission: 6, menuPermission: 32 }
  }
  return { dataPermission: '本厂数据', funcPermission: 10, menuPermission: 55 }
}
