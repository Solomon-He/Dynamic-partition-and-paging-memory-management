<script setup>
import { usePagingStore } from '@/stores/paging'
import { storeToRefs } from 'pinia'
import { ref, watch, nextTick } from 'vue'

const store = usePagingStore()
const { instructions, executionHistory } = storeToRefs(store)

// 添加对时间线容器的引用
const timelineWrapper = ref(null)

// 监听指令列表变化
watch(
  () => instructions.value,
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

// 获取指令执行结果
const getExecutionResult = (instructionId) => {
  return executionHistory.value.find((history) => history.instructionId === instructionId)
}
</script>

<template>
  <div class="instruction-timeline">
    <h3>指令序列</h3>
    <div ref="timelineWrapper" class="timeline-wrapper">
      <el-timeline>
        <el-timeline-item
          v-for="instruction in instructions"
          :key="instruction.id"
          :type="getExecutionResult(instruction.id)?.pageFault ? 'warning' : 'success'"
          size="normal"
          :hollow="true"
        >
          <div class="instruction-item">
            <div class="instruction-header">
              <div class="left">
                <span class="id">#{{ instruction.id }}</span>
                <el-tag
                  :type="getExecutionResult(instruction.id)?.pageFault ? 'warning' : 'success'"
                  size="small"
                  effect="light"
                  round
                >
                  {{ getExecutionResult(instruction.id)?.pageFault ? '缺页' : '不缺页' }}
                </el-tag>
              </div>
              <div class="right">
                <el-tag size="small" effect="plain" round>
                  物理地址：{{ getExecutionResult(instruction.id)?.physicalAddress }}
                </el-tag>
              </div>
            </div>
            <div class="instruction-content">
              <div class="instruction-info">
                <el-tag
                  size="small"
                  :type="instruction.operation === 'save' ? 'warning' : ''"
                  effect="plain"
                >
                  {{ instruction.operation }}
                </el-tag>
                <span class="text">页号：{{ instruction.pageNo }}</span>
                <span class="text">偏移：{{ instruction.offset }}</span>
              </div>
            </div>
          </div>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.instruction-timeline {
  height: 100%; // 占满父容器高度
  display: flex; // 使用弹性布局
  flex-direction: column; // 垂直排列子元素

  h3 {
    margin: 0 0 12px; // 上右下左边距
    font-size: 14px; // 标题字体大小
    font-weight: 600; // 标题字体粗细
    color: var(--el-text-color-primary); // 使用Element Plus主题变量
  }

  .timeline-wrapper {
    flex: 1; // 占用剩余空间
    overflow-y: auto; // 垂直方向内容溢出时显示滚动条
    padding-right: 12px; // 右侧内边距，避免内容贴近滚动条
    scroll-behavior: smooth; // 添加平滑滚动效果

    /* 自定义滚动条样式 */
    &::-webkit-scrollbar {
      width: 6px; // 滚动条宽度
      height: 6px; // 滚动条高度
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--el-border-color); // 滚动条滑块颜色
      border-radius: 3px; // 滑块圆角

      &:hover {
        background-color: var(--el-border-color-darker); // 鼠标悬停时滑块颜色
      }
    }

    &::-webkit-scrollbar-track {
      background-color: var(--el-fill-color-lighter); // 滚动条轨道颜色
      border-radius: 3px; // 轨道圆角
    }

    :deep(.el-timeline) {
      padding-left: 16px; // 时间线左侧内边距
    }

    .instruction-item {
      padding: 4px 0; // 上下内边距

      .instruction-header {
        display: flex; // 使用弹性布局
        align-items: center; // 垂直居中对齐
        justify-content: space-between; // 两端对齐
        margin-bottom: 8px; // 底部外边距

        .left {
          display: flex; // 使用弹性布局
          align-items: center; // 垂直居中对齐
          gap: 8px; // 子元素间距

          .id {
            font-size: 13px; // 字体大小
            font-weight: 600; // 字体粗细
            color: var(--el-text-color-primary); // 文本颜色
            font-family: var(--el-font-family-monospace); // 等宽字体
          }
        }
      }

      .instruction-content {
        .instruction-info {
          display: flex; // 使用弹性布局
          align-items: center; // 垂直居中对齐
          gap: 12px; // 子元素间距
          font-size: 13px; // 字体大小

          .text {
            color: var(--el-text-color-regular); // 文本颜色
            font-family: var(--el-font-family-monospace); // 等宽字体
          }
        }
      }
    }
  }

  :deep(.el-timeline-item__node) {
    &.is-success {
      background-color: var(--el-color-success); // 成功状态节点颜色
    }
    &.is-warning {
      background-color: var(--el-color-warning); // 警告状态节点颜色
    }
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
</style>
