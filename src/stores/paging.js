import { defineStore } from 'pinia'
import {
  generateUniqueFrameNumbers,
  generateDiskPosition,
  generateRandomInstruction,
} from '@/utils/memory'

export const usePagingStore = defineStore('paging', {
  state: () => {
    // 生成4个不重复的随机内存块号
    const initialFrameNumbers = generateUniqueFrameNumbers(4, 64)

    // 创建7个页面的初始状态
    const initialPageTable = Array.from({ length: 7 }, (_, index) => ({
      pageNo: index,
      flag: index < 4, // 前4个页面在内存中
      frameNo: index < 4 ? initialFrameNumbers[index] : null,
      modified: false,
      diskPosition: generateDiskPosition(),
    }))

    return {
      pageTable: initialPageTable,
      allocatedFrames: 4, // 分配给作业的内存块数量
      allocatedFramesList: [0, 1, 2, 3], // 初始时前4个页面在内存中
      pageReplacementHistory: [],
      // 新增指令序列
      instructions: [], // 存储格式：{ id, operation, pageNo, offset }
      // 新增指令操作类型
      operationTypes: ['+', '-', '*', '/', 'save', 'load'],
      // 新增指令执行历史
      executionHistory: [], // 存储格式：{ instructionId, physicalAddress, pageFault }
    }
  },

  actions: {
    // 处理缺页中断
    handlePageFault(pageNo) {
      // 记录缺页中断
      this.pageReplacementHistory.push({
        type: 'warning',
        pageNo,
        timestamp: Date.now(),
      })

      // 需要置换页面（FIFO算法）
      const victimPageNo = this.allocatedFramesList.shift()
      const victimPage = this.pageTable[victimPageNo]
      const frameNo = victimPage.frameNo

      // 更新被置换出的页面状态
      victimPage.flag = false
      victimPage.frameNo = null
      victimPage.modified = false

      // 更新新页面状态
      const newPage = this.pageTable[pageNo]
      newPage.flag = true
      newPage.frameNo = frameNo
      this.allocatedFramesList.push(pageNo)

      // 返回被淘汰的页号，供后续使用
      return victimPageNo
    },

    // 添加新指令
    addInstruction(operation, pageNo, offset) {
      const instruction = {
        id: this.instructions.length + 1,
        operation,
        pageNo,
        offset,
      }
      this.instructions.push(instruction)
      return instruction
    },

    // 执行指令
    executeInstruction(instruction) {
      const page = this.pageTable[instruction.pageNo]
      const pageFault = !page.flag
      let replacedPage = undefined

      if (pageFault) {
        // 调用处理缺页中断函数，并获取被淘汰的页号
        replacedPage = this.handlePageFault(instruction.pageNo)
      }

      // 如果是存储操作，设置修改标志
      if (instruction.operation === 'save') {
        page.modified = true
      }

      // 计算物理地址
      const physicalAddress = page.frameNo * 1024 + instruction.offset

      // 记录执行历史，添加被淘汰页信息
      this.executionHistory.push({
        instructionId: instruction.id,
        physicalAddress,
        pageFault,
        replacedPage: pageFault ? replacedPage : undefined,
      })

      return {
        physicalAddress,
        pageFault,
        replacedPage: pageFault ? replacedPage : undefined,
      }
    },

    // 重置系统
    resetSystem() {
      const initialFrameNumbers = generateUniqueFrameNumbers(4, 64)

      this.pageTable.forEach((page, index) => {
        page.flag = index < 4
        page.frameNo = index < 4 ? initialFrameNumbers[index] : null
        page.modified = false
        page.diskPosition = generateDiskPosition()
      })

      this.allocatedFramesList = [0, 1, 2, 3]
      this.pageReplacementHistory = []
      this.instructions = []
      this.executionHistory = []
    },

    // 生成随机指令
    generateRandomInstruction() {
      return generateRandomInstruction(this.operationTypes)
    },
  },
})
