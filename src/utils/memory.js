/**
 * 生成不重复的随机内存块号
 * @param {number} count - 需要生成的数量
 * @param {number} max - 最大值（不包含）
 * @returns {number[]} - 不重复的随机数组
 */
export function generateUniqueFrameNumbers(count, max) {
  const numbers = new Set()
  while (numbers.size < count) {
    numbers.add(Math.floor(Math.random() * max))
  }
  return Array.from(numbers)
}

/**
 * 生成随机磁盘位置（格式：xyz，其中x是0-1的数字，y和z是0-9的数字）
 * @returns {string} - 三位数字组成的字符串
 */
export function generateDiskPosition() {
  const x = Math.floor(Math.random() * 2) // 0 或 1
  const y = Math.floor(Math.random() * 10)
  const z = Math.floor(Math.random() * 10)
  return `${x}${y}${z}`
}

/**
 * 生成随机指令
 * @param {string[]} operationTypes - 可用的操作类型列表
 * @param {number} maxPageNo - 最大页号（不包含）
 * @param {number} maxOffset - 最大页内偏移（不包含）
 * @returns {{ operation: string, pageNo: number, offset: number }} - 随机生成的指令
 */
export function generateRandomInstruction(operationTypes, maxPageNo = 7, maxOffset = 1024) {
  const operation = operationTypes[Math.floor(Math.random() * operationTypes.length)]
  const pageNo = Math.floor(Math.random() * maxPageNo)
  const offset = Math.floor(Math.random() * maxOffset)
  return { operation, pageNo, offset }
}
