import { defineStore } from 'pinia'

export const usePartitionStore = defineStore('partition', {
  state: () => ({
    // 内存配置
    totalMemory: 64, // 总内存大小（KB）
    osSize: 10, // 操作系统占用大小（KB）
    algorithm: 'first-fit', // 当前选择的分配算法

    // 分区表
    partitions: [
      // 初始状态：一个被操作系统占用的分区和一个空闲分区
      {
        id: 'os',
        startAddress: 0,
        size: 10,
        status: 'occupied',
        processId: 'os',
      },
      {
        id: 'free-1',
        startAddress: 10,
        size: 54,
        status: 'free',
        processId: null,
      },
    ],

    // 进程列表
    processes: [
      {
        id: 'os',
        name: '操作系统',
        size: 10,
        status: 'running',
      },
    ],
  }),

  getters: {
    // 获取可用内存大小
    availableMemory: (state) => state.totalMemory - state.osSize,

    // 获取空闲分区列表
    freePartitions: (state) => state.partitions.filter((p) => p.status === 'free'),

    // 获取已占用分区列表
    occupiedPartitions: (state) => state.partitions.filter((p) => p.status === 'occupied'),

    // 计算内存使用率
    memoryUsage: (state) => {
      const usedMemory = state.partitions
        .filter((p) => p.status === 'occupied')
        .reduce((sum, p) => sum + p.size, 0)
      return ((usedMemory / state.totalMemory) * 100).toFixed(2)
    },
  },

  actions: {
    // 更新内存配置
    updateMemorySettings(totalMemory, osSize) {
      // 验证参数
      if (totalMemory < osSize) {
        throw new Error('总内存不能小于操作系统占用大小')
      }

      this.totalMemory = totalMemory
      this.osSize = osSize

      // 重新初始化分区表
      this.initializePartitions()
    },

    // 更新分配算法
    updateAlgorithm(algorithm) {
      if (!['first-fit', 'best-fit', 'worst-fit'].includes(algorithm)) {
        throw new Error('无效的分配算法')
      }
      this.algorithm = algorithm
    },

    // 初始化分区表
    initializePartitions() {
      this.partitions = [
        {
          id: 'os',
          startAddress: 0,
          size: this.osSize,
          status: 'occupied',
          processId: 'os',
        },
        {
          id: 'free-1',
          startAddress: this.osSize,
          size: this.totalMemory - this.osSize,
          status: 'free',
          processId: null,
        },
      ]
    },

    // 重置系统到初始状态
    resetSystem() {
      // 重置内存配置到默认值
      this.totalMemory = 64
      this.osSize = 10
      this.algorithm = 'first-fit'

      // 重新初始化分区表
      this.initializePartitions()

      // 重置进程列表，只保留操作系统
      this.processes = [
        {
          id: 'os',
          name: '操作系统',
          size: 10,
          status: 'running',
        },
      ]
    },

    // 创建新进程
    createProcess(size, duration = null) {
      // 生成唯一ID
      const id = `p-${Date.now()}`

      // 如果没有指定持续时间，随机生成3-15秒
      const processDuration = duration || Math.floor(Math.random() * 13) + 3

      // 创建进程对象
      const process = {
        id,
        size,
        duration: processDuration,
        status: 'waiting', // 初始状态为等待
      }

      // 添加到进程列表
      this.processes.push(process)

      return process
    },
  },
})
