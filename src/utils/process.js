/**
 * 生成唯一的进程ID
 * 格式: p-xxxx (x为时间戳后4位)
 * @returns {string} 进程ID
 */
export const generateId = () => {
  // 获取时间戳后4位作为进程ID
  const timestamp = Date.now().toString().slice(-4)

  // 返回格式化的进程ID
  return `p-${timestamp}`
}

/**
 * 生成随机的进程运行时间（如果用户没有指定）
 * @param {number} min 最小时间（秒）
 * @param {number} max 最大时间（秒）
 * @returns {number} 随机生成的运行时间
 */
export const generateRandomDuration = (min = 5, max = 20) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
