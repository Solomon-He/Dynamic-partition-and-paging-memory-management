<script setup>
import PageVisualization from './components/PageVisualization.vue'
import PageTable from './components/PageTable.vue'
import ControlPanel from './components/ControlPanel.vue'
</script>

<template>
  <div class="page-container">
    <!-- 页面标题区域 -->
    <div class="page-header">
      <h2>动态分页管理</h2>
      <div class="description">
        <el-alert type="info" :closable="false" show-icon>
          <template #default>
            使用 FIFO 算法进行页面置换，可视化展示置换过程，实时显示页表状态变化，支持物理地址计算。
          </template>
        </el-alert>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="page-content">
      <!-- 左侧：页面可视化和页表在同一个卡片中 -->
      <div class="left-section">
        <div class="card">
          <div class="visualization-container">
            <PageVisualization />
          </div>
          <div class="divider"></div>
          <div class="table-container">
            <PageTable />
          </div>
        </div>
      </div>

      <!-- 右侧：控制面板 -->
      <div class="right-section">
        <div class="card">
          <ControlPanel />
        </div>
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
  box-sizing: border-box;

  .page-header {
    flex-shrink: 0;

    h2 {
      margin: 0 0 12px;
      font-size: 18px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }

    .description {
      :deep(.el-alert) {
        padding: 8px 16px;

        .el-alert__content {
          flex: 1;
          padding: 0;
          font-size: 13px;
          color: var(--el-text-color-regular);
        }

        .el-alert__icon {
          margin-right: 8px;
        }
      }
    }
  }

  .page-content {
    flex: 1;
    display: flex;
    gap: 20px;
    min-height: 0;

    .left-section {
      flex: 7;
      min-height: 0;
      display: flex;
      flex-direction: column;
    }

    .right-section {
      flex: 3;
      min-height: 0;
      display: flex;
      flex-direction: column;
    }

    .card {
      flex: 1;
      background-color: var(--el-bg-color-overlay);
      border-radius: 8px;
      box-shadow: var(--el-box-shadow-light);
      padding: 16px;
      display: flex;
      flex-direction: column;
      min-height: 0;
    }

    .left-section .card {
      .visualization-container {
        flex: 2;
        min-height: 0;
      }

      .divider {
        height: 1px;
        background-color: var(--el-border-color-lighter);
        margin: 16px 0;
      }

      .table-container {
        flex: 3;
        min-height: 0;
      }
    }

    .right-section .card {
      overflow: hidden; // 确保内容不会溢出
    }
  }
}
</style>
