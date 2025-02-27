<script setup>
import { usePagingStore } from '@/stores/paging'
import { storeToRefs } from 'pinia'
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

const store = usePagingStore()
const { allocatedFramesList, executionHistory } = storeToRefs(store)

// ECharts 实例
const statsChartRef = ref(null)
let statsChart = null

// 计算统计数据
const statistics = computed(() => {
  const total = executionHistory.value.length
  const faults = executionHistory.value.filter((h) => h.pageFault).length

  return {
    total,
    faults,
    faultRate: total > 0 ? ((faults / total) * 100).toFixed(2) : 0,
  }
})

// 统计图表配置
const getStatsChartOption = computed(() => {
  return {
    title: {
      text: '缺页统计',
      left: 'center',
      top: 0,
      textStyle: {
        fontSize: 14,
        color: 'var(--el-text-color-primary)',
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '40px',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: ['总指令数', '缺页次数', '缺页率(%)'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '数值',
        type: 'bar',
        data: [
          {
            value: statistics.value.total,
            itemStyle: { color: '#409EFF' },
          },
          {
            value: statistics.value.faults,
            itemStyle: { color: '#E6A23C' },
          },
          {
            value: statistics.value.faultRate,
            itemStyle: { color: '#F56C6C' },
          },
        ],
        label: {
          show: true,
          position: 'top',
        },
      },
    ],
  }
})

// 监听数据变化
watch(
  [() => executionHistory.value, () => allocatedFramesList.value],
  () => {
    statsChart?.setOption(getStatsChartOption.value)
  },
  { deep: true },
)

// 初始化图表
const initCharts = () => {
  if (statsChartRef.value) {
    statsChart = echarts.init(statsChartRef.value)
    statsChart.setOption(getStatsChartOption.value)
  }
}

// 处理窗口大小变化
const handleResize = () => {
  statsChart?.resize()
}

onMounted(() => {
  initCharts()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  statsChart?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div class="page-visualization">
    <div class="visualization-content">
      <!-- 左侧：统计图表 -->
      <div class="stats-section">
        <div ref="statsChartRef" class="stats-chart"></div>
      </div>

      <!-- 右侧：FIFO 队列状态 -->
      <div class="fifo-queue">
        <h3>FIFO 队列状态</h3>
        <div class="queue-container">
          <div v-if="allocatedFramesList.length === 0" class="empty-queue">队列为空</div>
          <div v-else class="queue-items">
            <div
              v-for="(pageNo, index) in allocatedFramesList"
              :key="pageNo"
              class="queue-item"
              :class="{ 'next-victim': index === 0 }"
            >
              <span class="page-no">页 {{ pageNo }}</span>
              <div v-if="index === 0" class="victim-indicator">
                <div class="victim-label">下一个被淘汰</div>
                <div class="victim-arrow"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-visualization {
  height: 100%; // 使组件占满父容器高度
  display: flex; // 启用弹性布局
  flex-direction: column; // 垂直排列子元素

  .visualization-content {
    flex: 1; // 占用剩余空间
    display: grid; // 使用网格布局
    grid-template-columns: 1fr 1fr; // 左右两列等宽
    gap: 16px; // 列间距
    min-height: 0; // 允许容器在flex布局中收缩

    // 左侧统计图表区域
    .stats-section {
      display: flex; // 启用弹性布局
      flex-direction: column; // 垂直排列子元素

      .stats-chart {
        flex: 1; // 占用剩余空间
        min-height: 200px; // 最小高度，确保图表可见
      }
    }

    // 右侧FIFO队列区域
    .fifo-queue {
      border-radius: 4px; // 圆角边框
      padding: 12px; // 内边距
      background-color: white; // 白色背景
      display: flex; // 启用弹性布局
      flex-direction: column; // 垂直排列子元素

      // 标题样式
      h3 {
        margin: 0 0 12px; // 上右下左边距
        font-size: 14px; // 字体大小
        font-weight: 600; // 字体粗细
        color: var(--el-text-color-primary); // 文字颜色
        text-align: center; // 文字居中
      }

      // 队列容器
      .queue-container {
        flex: 1; // 占用剩余空间
        display: flex; // 启用弹性布局
        align-items: center; // 垂直居中
        justify-content: center; // 水平居中
        padding: 12px 0; // 上下内边距

        // 队列为空时的提示
        .empty-queue {
          text-align: center; // 文字居中
          color: var(--el-text-color-secondary); // 次要文字颜色
          font-style: italic; // 斜体
        }

        // 队列项容器
        .queue-items {
          display: flex; // 启用弹性布局
          flex-direction: row; // 水平排列
          flex-wrap: wrap; // 允许换行
          gap: 16px; // 项间距
          justify-content: center; // 水平居中
          align-items: center; // 垂直居中

          // 单个队列项
          .queue-item {
            position: relative; // 相对定位，用于放置标记
            display: flex; // 启用弹性布局
            align-items: center; // 垂直居中

            // 页号显示
            .page-no {
              min-width: 60px; // 最小宽度
              height: 40px; // 高度
              display: flex; // 启用弹性布局
              align-items: center; // 垂直居中
              justify-content: center; // 水平居中
              border: 1px solid var(--el-border-color); // 边框
              border-radius: 4px; // 圆角
              background-color: var(--el-bg-color); // 背景色
              padding: 0 12px; // 左右内边距
              font-weight: 500; // 字体粗细
              color: var(--el-text-color-primary); // 文字颜色
            }

            // 下一个被淘汰的页面样式
            &.next-victim .page-no {
              border-color: var(--el-color-danger); // 红色边框
              background-color: var(--el-color-danger-light); // 浅红色背景
            }

            // 被淘汰指示器（箭头+标签）
            .victim-indicator {
              position: absolute; // 绝对定位
              top: -40px; // 上方偏移
              left: 50%; // 水平居中
              transform: translateX(-50%); // 水平居中调整
              display: flex; // 启用弹性布局
              flex-direction: column; // 垂直排列
              align-items: center; // 水平居中

              // 标签样式
              .victim-label {
                background-color: var(--el-color-danger); // 红色背景
                color: white; // 白色文字
                font-size: 12px; // 小字体
                padding: 2px 8px; // 内边距
                border-radius: 4px; // 圆角
                white-space: nowrap; // 不换行
                margin-bottom: 4px; // 底部外边距
              }

              // 箭头样式
              .victim-arrow {
                width: 0; // 宽度为0
                height: 0; // 高度为0
                border-left: 6px solid transparent; // 左边框透明
                border-right: 6px solid transparent; // 右边框透明
                border-top: 8px solid var(--el-color-danger); // 上边框为红色，形成箭头
              }
            }
          }
        }
      }
    }
  }
}
</style>
