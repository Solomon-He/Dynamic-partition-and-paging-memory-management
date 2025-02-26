<script setup>
import { usePartitionStore } from '@/stores/partition'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const store = usePartitionStore()
const { partitions } = storeToRefs(store)

// 计算每个分区的百分比宽度
const partitionWidths = computed(() => {
  const totalMemory = store.totalMemory
  return partitions.value.map((partition) => ({
    ...partition,
    width: (partition.size / totalMemory) * 100,
  }))
})

// 获取进程名称
const getProcessName = (processId) => {
  if (processId === 'os') return '操作系统'
  return processId ? processId : '空闲'
}

// 获取分区的样式
const getPartitionStyle = (partition) => {
  const style = {
    width: `${partition.width}%`,
  }

  if (partition.status === 'occupied') {
    style.backgroundColor =
      partition.processId === 'os'
        ? 'var(--el-color-danger-light-5)' // 操作系统使用红色
        : 'var(--el-color-success-light-5)' // 普通进程使用绿色
  } else {
    style.backgroundColor = 'var(--el-color-info-light-5)' // 空闲分区使用灰色
  }

  return style
}
</script>

<template>
  <div class="memory-visualization">
    <!-- 内存条 -->
    <div class="memory-bar">
      <div
        v-for="partition in partitionWidths"
        :key="partition.id"
        class="partition"
        :style="getPartitionStyle(partition)"
      >
        <div class="partition-info">
          <span class="process-name">{{ getProcessName(partition.processId) }}</span>
          <span class="size">{{ partition.size }}KB</span>
        </div>
      </div>
    </div>

    <!-- 图例说明 -->
    <div class="legend">
      <div class="legend-item">
        <div class="color-block os"></div>
        <span>操作系统</span>
      </div>
      <div class="legend-item">
        <div class="color-block process"></div>
        <span>进程</span>
      </div>
      <div class="legend-item">
        <div class="color-block free"></div>
        <span>空闲</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.memory-visualization {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .memory-bar {
    flex: 1;
    display: flex;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    overflow: hidden;

    .partition {
      height: 100%;
      position: relative;
      transition: all 0.3s ease;
      min-width: 2px; // 确保非常小的分区也能看到

      &:not(:last-child) {
        border-right: 1px solid var(--el-border-color);
      }

      .partition-info {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        width: 100%;
        padding: 0 4px;
        font-size: 12px;
        color: var(--el-text-color-regular);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        .process-name {
          display: block;
          margin-bottom: 4px;
        }

        .size {
          opacity: 0.8;
        }
      }
    }
  }

  .legend {
    display: flex;
    gap: 16px;
    justify-content: center;
    padding: 8px;

    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: var(--el-text-color-regular);

      .color-block {
        width: 16px;
        height: 16px;
        border-radius: 4px;

        &.os {
          background-color: var(--el-color-danger-light-5);
        }

        &.process {
          background-color: var(--el-color-success-light-5);
        }

        &.free {
          background-color: var(--el-color-info-light-5);
        }
      }
    }
  }
}
</style>
