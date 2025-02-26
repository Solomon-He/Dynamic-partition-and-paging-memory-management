<script setup>
import { usePartitionStore } from '@/stores/partition'
import { storeToRefs } from 'pinia'
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

const store = usePartitionStore()
const { partitions, memoryHistory } = storeToRefs(store)

// ECharts 实例
const pieChartRef = ref(null)
const lineChartRef = ref(null)
let pieChart = null
let lineChart = null

// 计算图表数据
const getPieOption = computed(() => {
  const data = partitions.value.map((partition) => ({
    value: partition.size,
    name:
      partition.processId === 'os'
        ? '操作系统'
        : partition.status === 'free'
          ? '空闲'
          : `进程 ${partition.processId}`,
    itemStyle: {
      color:
        partition.processId === 'os'
          ? '#F56C6C'
          : partition.status === 'free'
            ? '#909399'
            : '#67C23A',
    },
  }))

  return {
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        return `${params.name}<br/>大小：${params.value}KB (${params.percent}%)`
      },
    },
    // legend: {
    //   orient: 'horizontal',
    //   bottom: '0',
    //   data: [
    //     '操作系统',
    //     '空闲',
    //     ...data
    //       .filter((item) => !['操作系统', '空闲'].includes(item.name))
    //       .map((item) => item.name),
    //   ],
    // },
    series: [
      {
        name: '内存使用情况',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 4,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          formatter: '{b}\n{c}KB',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
          },
        },
        data: data,
      },
    ],
  }
})

// 折线图配置
const getLineOption = computed(() => {
  const data = memoryHistory.value.map((item) => ({
    value: [item.timestamp, item.usage],
  }))

  return {
    title: {
      text: '内存使用率趋势',
      left: 'center',
      top: 0,
      textStyle: {
        fontSize: 14,
        color: 'var(--el-text-color-primary)',
      },
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        if (params && params[0] && params[0].data) {
          const timestamp = params[0].data.value[0]
          const usage = params[0].data.value[1]
          const time = new Date(timestamp).toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })
          return `时间：${time}<br/>使用率：${usage}%`
        }
        return ''
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '8%',
      top: '40px',
      containLabel: true,
    },
    xAxis: {
      type: 'time',
      show: false,
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      interval: 20,
      splitLine: {
        lineStyle: {
          type: 'dashed',
        },
      },
      axisLabel: {
        formatter: '{value}%',
      },
    },
    series: [
      {
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        data: data,
        itemStyle: {
          color: '#409EFF',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(64,158,255,0.3)',
            },
            {
              offset: 1,
              color: 'rgba(64,158,255,0.1)',
            },
          ]),
        },
      },
    ],
  }
})

// 监听数据变化
watch(
  [() => partitions.value, () => memoryHistory.value],
  () => {
    pieChart?.setOption(getPieOption.value)
    lineChart?.setOption(getLineOption.value)
  },
  { deep: true },
)

// 初始化图表
const initCharts = () => {
  if (pieChartRef.value) {
    pieChart = echarts.init(pieChartRef.value)
    pieChart.setOption(getPieOption.value)
  }
  if (lineChartRef.value) {
    lineChart = echarts.init(lineChartRef.value)
    lineChart.setOption(getLineOption.value)
  }
}

// 处理窗口大小变化
const handleResize = () => {
  pieChart?.resize()
  lineChart?.resize()
}

onMounted(() => {
  initCharts()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  pieChart?.dispose()
  lineChart?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div class="memory-visualization">
    <div class="charts-container">
      <div ref="pieChartRef" class="pie-chart"></div>
      <div ref="lineChartRef" class="line-chart"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.memory-visualization {
  height: 100%;
  display: flex;
  flex-direction: column;

  .charts-container {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    min-height: 0;

    .pie-chart,
    .line-chart {
      height: 100%;
      min-height: 0;
    }
  }
}
</style>
