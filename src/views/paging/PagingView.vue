<script setup>
import PageVisualization from './components/PageVisualization.vue'
import PageTable from './components/PageTable.vue'
import ControlPanel from './components/ControlPanel.vue'
import InstructionTimeline from './components/InstructionTimeline.vue'
</script>

<template>
  <div class="page-container">
    <!-- 页面标题区域 -->
    <div class="page-header">
      <h2>动态分页管理</h2>
      <p class="description">
        使用 FIFO 算法进行页面置换，可视化展示置换过程，实时显示页表状态变化，支持物理地址计算。
      </p>
    </div>

    <!-- 主要内容区域 -->
    <div class="page-content">
      <!-- 左侧：可视化和状态 -->
      <div class="section left-section">
        <!-- 可视化区域 -->
        <div class="visualization-container">
          <PageVisualization />
        </div>
        <!-- 状态区域 -->
        <div class="status-container">
          <div class="table-section">
            <PageTable />
          </div>
          <div class="timeline-section">
            <InstructionTimeline />
          </div>
        </div>
      </div>

      <!-- 右侧：控制面板 -->
      <div class="section right-section">
        <ControlPanel />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-container {
  height: 100vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: var(--el-bg-color);

  .page-header {
    flex-shrink: 0;

    h2 {
      margin: 0 0 12px;
      font-size: 18px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }

    .description {
      margin-top: 8px;
      color: var(--el-text-color-secondary);
      font-size: 14px;
    }
  }

  .page-content {
    flex: 1;
    display: flex;
    gap: 20px;
    min-height: 0;

    // 公共样式
    .section {
      min-height: 0;
      display: flex;
      flex-direction: column;
      background-color: var(--el-bg-color-overlay);
      border-radius: 8px;
      box-shadow: var(--el-box-shadow-light);
      padding: 8px 16px;
      overflow: hidden;
    }

    .left-section {
      flex: 7;

      .visualization-container {
        flex: 1;
        min-height: 0;
      }

      .status-container {
        flex: 1;
        display: flex;
        gap: 30px;
        min-height: 0;

        .table-section {
          flex: 5;
          min-height: 0;
        }

        .timeline-section {
          flex: 3;
          min-height: 0;
        }
      }
    }

    .right-section {
      flex: 3;
    }
  }
}
</style>
