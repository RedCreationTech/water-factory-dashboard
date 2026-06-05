import { useState, useMemo } from 'react'
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Link2,
  Trash2,
} from 'lucide-react'
import Panel from '@/components/Panel'
import type { User } from './mockData'
import { plantOptions, roleOptions, statusOptions } from './mockData'

interface UserListPanelProps {
  users: User[]
  selectedKey: string
  onSelect: (user: User) => void
}

export default function UserListPanel({ users, selectedKey, onSelect }: UserListPanelProps) {
  const [plantFilter, setPlantFilter] = useState('全部水厂')
  const [roleFilter, setRoleFilter] = useState('全部角色')
  const [statusFilter, setStatusFilter] = useState('全部状态')
  const [searchText, setSearchText] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (plantFilter !== '全部水厂' && u.plant !== plantFilter) return false
      if (roleFilter !== '全部角色' && u.role !== roleFilter) return false
      if (statusFilter !== '全部状态') {
        if (statusFilter === '在线' && u.status !== 'online') return false
        if (statusFilter === '离线' && u.status !== 'offline') return false
      }
      if (searchText) {
        const q = searchText.toLowerCase()
        if (!u.username.toLowerCase().includes(q) && !u.name.includes(q)) return false
      }
      return true
    })
  }, [users, plantFilter, roleFilter, statusFilter, searchText])

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handlePageChange = (p: number) => {
    if (p >= 1 && p <= totalPages) setPage(p)
  }

  const pageNumbers = useMemo(() => {
    const pages: number[] = []
    for (let i = 1; i <= totalPages; i++) pages.push(i)
    return pages
  }, [totalPages])

  return (
    <Panel title="用户列表" className="flex-1 flex flex-col min-w-0">
      {/* Filter bar */}
      <div className="flex items-center gap-2 mb-3 flex-wrap flex-shrink-0">
        {/* 所属水厂 */}
        <select
          value={plantFilter}
          onChange={(e) => { setPlantFilter(e.target.value); setPage(1) }}
          className="h-7 px-2 rounded border border-border-primary bg-bg-panel text-xs text-text-secondary focus:outline-none focus:border-accent-cyan cursor-pointer"
        >
          {plantOptions.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        {/* 角色 */}
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1) }}
          className="h-7 px-2 rounded border border-border-primary bg-bg-panel text-xs text-text-secondary focus:outline-none focus:border-accent-cyan cursor-pointer"
        >
          {roleOptions.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        {/* 状态 */}
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
          className="h-7 px-2 rounded border border-border-primary bg-bg-panel text-xs text-text-secondary focus:outline-none focus:border-accent-cyan cursor-pointer"
        >
          {statusOptions.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        {/* Search */}
        <div className="relative flex-1 min-w-[140px]">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-text-tertiary" />
          <input
            type="text"
            placeholder="请输入用户名或姓名"
            value={searchText}
            onChange={(e) => { setSearchText(e.target.value); setPage(1) }}
            className="w-full h-7 pl-7 pr-2 rounded border border-border-primary bg-bg-panel text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-cyan"
          />
        </div>
        {/* 新增用户 */}
        <button
          onClick={() => console.log('新增用户')}
          className="flex items-center gap-1 h-7 px-3 rounded bg-accent-cyan/20 border border-accent-cyan/50 text-accent-cyan text-xs font-medium hover:bg-accent-cyan/30 transition-colors flex-shrink-0"
        >
          <Plus className="w-3 h-3" />
          新增用户
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto custom-scrollbar min-h-0">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 z-10">
            <tr style={{ backgroundColor: 'rgba(15, 37, 64, 0.8)' }}>
              <th className="w-8 px-2 py-2 border-b border-border-subtle">
                <input type="checkbox" className="cursor-pointer accent-accent-cyan" onChange={() => {}} />
              </th>
              {[
                { key: 'username', title: '用户名', width: '90px' },
                { key: 'name', title: '姓名', width: '80px' },
                { key: 'role', title: '角色', width: '100px' },
                { key: 'plant', title: '所属水厂', width: '130px' },
                { key: 'lastLogin', title: '最近登录', width: '140px' },
                { key: 'status', title: '状态', width: '60px' },
                { key: 'action', title: '操作', width: '80px' },
              ].map((col) => (
                <th
                  key={col.key}
                  className="text-left px-2 py-2 text-xs text-text-secondary font-medium border-b border-border-subtle whitespace-nowrap"
                  style={{ width: col.width }}
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageUsers.map((user, idx) => {
              const isSelected = user.key === selectedKey
              return (
                <tr
                  key={user.key}
                  onClick={() => onSelect(user)}
                  className={
                    'transition-colors duration-200 cursor-pointer ' +
                    (isSelected ? 'bg-bg-active border-l-2 border-l-accent-cyan' : idx % 2 === 0 ? 'bg-[#0a1a2e]' : 'bg-[#0d1f35]')
                  }
                  style={{ height: 36 }}
                >
                  <td className="px-2 py-1.5 border-b border-border-subtle/30" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" className="cursor-pointer accent-accent-cyan" onChange={() => {}} />
                  </td>
                  <td className="px-2 py-1.5 text-xs text-text-primary border-b border-border-subtle/30">{user.username}</td>
                  <td className="px-2 py-1.5 text-xs text-text-primary border-b border-border-subtle/30">{user.name}</td>
                  <td className="px-2 py-1.5 text-xs text-text-secondary border-b border-border-subtle/30">{user.role}</td>
                  <td className="px-2 py-1.5 text-xs text-text-secondary border-b border-border-subtle/30">{user.plant}</td>
                  <td className="px-2 py-1.5 text-xs text-text-tertiary font-data border-b border-border-subtle/30">{user.lastLogin}</td>
                  <td className="px-2 py-1.5 text-xs border-b border-border-subtle/30">
                    <span className="inline-flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'online' ? 'bg-status-normal' : 'bg-status-offline'}`} />
                      <span className={user.status === 'online' ? 'text-status-normal' : 'text-text-tertiary'}>
                        {user.status === 'online' ? '在线' : '离线'}
                      </span>
                    </span>
                  </td>
                  <td className="px-2 py-1.5 text-xs border-b border-border-subtle/30" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => console.log('编辑用户', user.username)}
                        className="p-0.5 rounded hover:bg-white/10 transition-colors"
                        title="编辑"
                      >
                        <Edit3 className="w-3 h-3 text-text-secondary hover:text-accent-cyan" />
                      </button>
                      <button
                        onClick={() => console.log('关联', user.username)}
                        className="p-0.5 rounded hover:bg-white/10 transition-colors"
                        title="关联"
                      >
                        <Link2 className="w-3 h-3 text-text-secondary hover:text-accent-cyan" />
                      </button>
                      <button
                        onClick={() => console.log('删除用户', user.username)}
                        className="p-0.5 rounded hover:bg-white/10 transition-colors"
                        title="删除"
                      >
                        <Trash2 className="w-3 h-3 text-text-secondary hover:text-status-danger" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border-subtle flex-shrink-0">
        <span className="text-xs text-text-tertiary">
          共 {filteredUsers.length} 条记录
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="p-1 rounded border border-border-primary text-text-secondary hover:bg-bg-panel-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-3 h-3" />
          </button>
          {pageNumbers.map((p) => (
            <button
              key={p}
              onClick={() => handlePageChange(p)}
              className={
                'min-w-[24px] h-6 px-1 rounded text-xs font-medium transition-colors ' +
                (p === currentPage
                  ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/50'
                  : 'text-text-secondary hover:bg-bg-panel-hover border border-transparent')
              }
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="p-1 rounded border border-border-primary text-text-secondary hover:bg-bg-panel-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-3 h-3" />
          </button>
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }}
            className="h-6 ml-1 px-1 rounded border border-border-primary bg-bg-panel text-xs text-text-secondary focus:outline-none cursor-pointer"
          >
            <option value={10}>10条/页</option>
            <option value={20}>20条/页</option>
            <option value={50}>50条/页</option>
          </select>
        </div>
      </div>
    </Panel>
  )
}
