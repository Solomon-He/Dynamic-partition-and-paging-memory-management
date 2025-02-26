import { defineStore } from 'pinia'
import { generateId, generateRandomDuration } from '@/utils/process'

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
        duration: -1, // -1 表示持续运行
      },
    ],

    // 添加等待队列
    waitingQueue: [], // 存储等待内存分配的进程
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
          duration: -1, // -1 表示持续运行
        },
      ]

      // 清空等待队列
      this.waitingQueue = []
    },

    // 创建新进程
    createProcess(size, duration) {
      const processId = generateId()
      const process = {
        id: processId,
        size,
        status: 'waiting',
        duration: duration || generateRandomDuration(),
        startTime: null,
        createTime: Date.now(),
      }

      // 添加到进程列表
      this.processes.push(process)

      // 尝试分配内存
      const allocated = this.allocateMemory(process)
      if (allocated) {
        // 分配成功，直接启动进程
        this.startProcess(process)
      } else {
        // 分配失败，加入等待队列
        this.waitingQueue.push(process)
      }

      return processId
    },

    // 分配内存
    allocateMemory(process) {
      let targetPartition = null

      // 根据不同算法查找合适的分区
      switch (this.algorithm) {
        case 'first-fit':
          targetPartition = this.findFirstFit(process.size)
          break
        case 'best-fit':
          targetPartition = this.findBestFit(process.size)
          break
        case 'worst-fit':
          targetPartition = this.findWorstFit(process.size)
          break
      }

      if (!targetPartition) return false

      // 分割分区
      this.splitPartition(targetPartition, process)
      return true
    },

    // 最先适应算法
    findFirstFit(size) {
      return this.freePartitions.find((partition) => partition.size >= size)
    },

    // 最佳适应算法
    findBestFit(size) {
      return this.freePartitions
        .filter((partition) => partition.size >= size)
        .sort((a, b) => a.size - b.size)[0]
    },

    // 最坏适应算法
    findWorstFit(size) {
      return this.freePartitions
        .filter((partition) => partition.size >= size)
        .sort((a, b) => b.size - a.size)[0]
    },

    // 分割分区
    splitPartition(partition, process) {
      const index = this.partitions.indexOf(partition)

      // 创建已分配分区
      const allocatedPartition = {
        id: `allocated-${process.id}`,
        startAddress: partition.startAddress,
        size: process.size,
        status: 'occupied',
        processId: process.id,
      }

      // 如果有剩余空间，创建新的空闲分区
      const remainingSize = partition.size - process.size
      if (remainingSize > 0) {
        const freePartition = {
          id: `free-${Date.now()}`,
          startAddress: partition.startAddress + process.size,
          size: remainingSize,
          status: 'free',
          processId: null,
        }
        this.partitions.splice(index, 1, allocatedPartition, freePartition)
      } else {
        this.partitions.splice(index, 1, allocatedPartition)
      }
    },

    // 启动进程
    startProcess(process) {
      process.status = 'running'
      process.startTime = Date.now()

      // 设置进程结束时间
      if (process.duration > 0) {
        setTimeout(() => {
          this.endProcess(process.id)
        }, process.duration * 1000)
      }
    },

    // 尝试为等待队列中的进程分配内存
    tryAllocateWaitingProcesses() {
      if (this.waitingQueue.length === 0) return

      // 按创建时间排序，先来先服务
      const sortedQueue = [...this.waitingQueue].sort((a, b) => a.createTime - b.createTime)

      // 尝试为每个等待的进程分配内存
      for (let i = 0; i < sortedQueue.length; i++) {
        const process = sortedQueue[i]
        const allocated = this.allocateMemory(process)

        if (allocated) {
          // 分配成功，从等待队列中移除
          this.waitingQueue = this.waitingQueue.filter((p) => p.id !== process.id)
          // 启动进程
          this.startProcess(process)
        }
      }
    },

    // 结束进程
    endProcess(processId) {
      const process = this.processes.find((p) => p.id === processId)
      if (!process || process.status !== 'running') return

      process.status = 'finished'
      process.endTime = Date.now() // 记录结束时间

      // 释放内存并尝试分配给等待的进程
      this.releaseMemory(processId)
    },

    // 释放内存
    releaseMemory(processId) {
      const partitionIndex = this.partitions.findIndex((p) => p.processId === processId)
      if (partitionIndex === -1) return

      // 将分区标记为空闲
      const partition = this.partitions[partitionIndex]
      partition.status = 'free'
      partition.processId = null
      partition.id = `free-${Date.now()}`

      // 合并相邻的空闲分区
      this.mergeAdjacentFreePartitions()

      // 尝试为等待队列中的进程分配内存
      this.tryAllocateWaitingProcesses()
    },

    // 合并相邻的空闲分区
    mergeAdjacentFreePartitions() {
      let i = 0
      while (i < this.partitions.length - 1) {
        const current = this.partitions[i]
        const next = this.partitions[i + 1]

        if (current.status === 'free' && next.status === 'free') {
          // 合并分区
          current.size += next.size
          this.partitions.splice(i + 1, 1)
        } else {
          i++
        }
      }
    },
  },
})
