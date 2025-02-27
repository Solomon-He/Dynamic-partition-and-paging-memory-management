<script setup>
import { usePartitionStore } from '@/stores/partition'
import { storeToRefs } from 'pinia'
import { ref, watch, nextTick } from 'vue'

const store = usePartitionStore()
const { freePartitions, occupiedPartitions, processes } = storeToRefs(store)

// 添加对时间线容器的引用
const timelineWrapper = ref(null)

// 监听进程列表变化
watch(
  () => processes.value,
  () => {
    // 等待 DOM 更新后滚动到底部
    nextTick(() => {
      if (timelineWrapper.value) {
        timelineWrapper.value.scrollTop = timelineWrapper.value.scrollHeight
      }
    })
  },
  { deep: true },
)

// 获取进程状态对应的图标类型
const getProcessStatusInfo = (status) => {
  const statusMap = {
    waiting: 'info',
    running: 'success',
    finished: 'warning',
  }
  return statusMap[status] || 'info'
}

// 格式化进程ID显示
const formatProcessId = (id) => {
  if (id === 'os') return id
  return id.slice(0, 2) + id.slice(-4)
}
</script>

<template>
  <div class="partition-table">
    <div class="table-container">
      <!-- 分区表 -->
      <div class="partition-info">
        <!-- 空闲分区表 -->
        <div class="table-section">
          <h4>空闲分区表</h4>
          <el-table :data="freePartitions" border stripe>
            <el-table-column prop="startAddress" label="首地址" width="120">
              <template #default="{ row }"> {{ row.startAddress }} KB </template>
            </el-table-column>
            <el-table-column prop="size" label="大小" width="120">
              <template #default="{ row }"> {{ row.size }} KB </template>
            </el-table-column>
            <el-table-column prop="status" label="状态">
              <template #default>
                <el-tag type="success">空闲</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 已分配分区表 -->
        <div class="table-section">
          <h4>已分配分区表</h4>
          <el-table :data="occupiedPartitions" border stripe>
            <el-table-column prop="startAddress" label="首地址" width="120">
              <template #default="{ row }"> {{ row.startAddress }} KB </template>
            </el-table-column>
            <el-table-column prop="size" label="大小" width="120">
              <template #default="{ row }"> {{ row.size }} KB </template>
            </el-table-column>
            <el-table-column prop="processId" label="进程" width="100">
              <template #default="{ row }">
                {{ formatProcessId(row.processId) }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态">
              <template #default>
                <el-tag type="danger">占用</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <!-- 进程记录日志 -->
      <div class="process-log">
        <h4>进程记录</h4>
        <div class="timeline-wrapper" ref="timelineWrapper">
          <el-timeline>
            <el-timeline-item
              v-for="process in processes"
              :key="process.id"
              :type="getProcessStatusInfo(process.status)"
              size="normal"
              :hollow="true"
            >
              <div class="timeline-content">
                <div class="process-header">
                  <span class="process-id">{{ formatProcessId(process.id) }}</span>
                  <el-tag :type="getProcessStatusInfo(process.status)" size="small">
                    {{ process.status }}
                  </el-tag>
                </div>
                <div class="process-info">
                  <span>大小: {{ process.size }}KB</span>
                  <span>时长: {{ process.duration || '-' }} s</span>
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.partition-table {
  height: 100%; // 占满父容器高度
  display: flex; // 启用 flex 布局
  flex-direction: column; // 纵向排列
  min-height: 0; // 允许容器在 flex 布局中收缩

  .table-container {
    display: flex; // 启用 flex 布局
    gap: 20px; // 子元素间距
    height: 100%; // 占满父容器高度
    min-height: 0; // 允许容器在 flex 布局中收缩
    overflow: hidden; // 防止内容溢出

    .partition-info {
      flex: 3;
      display: flex;
      flex-direction: column;
      gap: 20px;
      min-width: 0;
      overflow-y: auto; // 添加垂直滚动
      padding-right: 8px; // 为滚动条留出空间

      // 自定义滚动条样式
      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-thumb {
        background-color: var(--el-border-color-lighter);
        border-radius: 3px;
      }

      &::-webkit-scrollbar-track {
        background-color: transparent;
      }

      .table-section {
        flex-shrink: 0; // 防止表格被压缩
      }
    }

    .process-log {
      flex: 2; // 占据 2/5 的宽度
      min-width: 0; // 允许容器在 flex 布局中收缩
      display: flex; // 启用 flex 布局
      flex-direction: column; // 纵向排列
      overflow: hidden; // 防止内容溢出

      h4 {
        flex-shrink: 0; // 防止标题被压缩
      }

      .timeline-wrapper {
        flex: 1; // 占满剩余空间
        overflow-y: auto; // 启用垂直滚动
        min-height: 0; // 允许容器在 flex 布局中收缩
        padding: 0 8px 0 4px;
        scroll-behavior: smooth; // 添加平滑滚动效果

        // 自定义滚动条样式
        &::-webkit-scrollbar {
          width: 6px; // 滚动条宽度
        }

        &::-webkit-scrollbar-thumb {
          background-color: var(--el-border-color-lighter); // 滚动条颜色
          border-radius: 3px; // 滚动条圆角
        }

        &::-webkit-scrollbar-track {
          background-color: transparent; // 滚动条轨道透明
        }

        // 调整时间线组件样式
        // :deep(.el-timeline) {
        //   padding-left: 16px; // 左侧留出空间给时间线节点
        //   padding-bottom: 16px; // 底部留出空间
        // }
      }

      .timeline-content {
        padding: 4px 0; // 内容上下间距

        .process-header {
          display: flex; // 启用 flex 布局
          justify-content: space-between; // 两端对齐
          align-items: center; // 垂直居中
          margin-bottom: 8px; // 底部间距

          .process-id {
            font-weight: 500; // 加粗字体
            color: var(--el-text-color-primary); // 使用主文本颜色
          }
        }

        .process-info {
          display: flex; // 启用 flex 布局
          gap: 16px; // 子元素间距
          color: var(--el-text-color-regular); // 使用常规文本颜色
          font-size: 13px; // 设置字体大小
        }
      }

      // 添加时间线样式
      :deep(.el-timeline-item__node) {
        width: 12px !important; // 强制设置节点宽度
        height: 12px !important; // 强制设置节点高度
      }

      :deep(.el-timeline-item__wrapper) {
        padding-bottom: 16px; // 时间线项底部内边距
      }

      :deep(.el-timeline-item__tail) {
        border-left-style: dashed; // 时间线使用虚线样式
      }
    }
  }

  // 标题样式
  h4 {
    margin: 0 0 12px; // 设置外边距
    color: var(--el-text-color-regular); // 使用常规文本颜色
    font-size: 14px; // 设置字体大小
    font-weight: 500; // 设置字体粗细
  }

  // 表格全局样式
  :deep(.el-table) {
    --el-table-border-color: var(--el-border-color-lighter); // 设置表格边框颜色

    .el-table__cell {
      padding: 8px; // 设置单元格内边距
    }
  }
}
</style>
