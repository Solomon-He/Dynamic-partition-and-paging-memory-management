<script setup>
// 引入组件
import MemoryVisualization from './components/MemoryVisualization.vue'
import PartitionTable from './components/PartitionTable.vue'
import ControlPanel from './components/ControlPanel.vue'
</script>

<template>
  <div class="partition-container">
    <!-- 页面标题区域 -->
    <div class="partition-header">
      <h2>动态分区管理</h2>
      <p class="description">
        模拟实现动态分区管理中内存的分配和回收过程，支持最先适应、最佳适应和最坏适应三种分配算法。
      </p>
    </div>

    <!-- 主要内容区域 -->
    <div class="partition-content">
      <!-- 左侧区域：包含内存可视化和分区表 -->
      <div class="left-section">
        <div class="visualization-container">
          <h3>内存使用情况</h3>
          <MemoryVisualization />
        </div>
        <div class="table-container">
          <h3>分区表</h3>
          <PartitionTable />
        </div>
      </div>

      <!-- 右侧控制面板 -->
      <div class="right-section">
        <h3>控制面板</h3>
        <ControlPanel />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.partition-container {
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow: hidden;

  .partition-header {
    h2 {
      color: var(--el-text-color-primary);
      font-size: 24px;
    }

    .description {
      margin-top: 8px;
      color: var(--el-text-color-secondary);
      font-size: 14px;
    }
  }

  .partition-content {
    flex: 1;
    display: flex;
    gap: 20px;
    min-height: 0;

    // 左右区域的共同样式
    .left-section,
    .right-section {
      background-color: var(--el-bg-color);
      border-radius: 8px;
      box-shadow: var(--el-box-shadow-lighter);

      h3 {
        margin: 0 0 16px;
        color: var(--el-text-color-primary);
        font-size: 18px;
      }
    }

    .left-section {
      flex: 7;
      display: flex;
      flex-direction: column;
      gap: 20px;

      .visualization-container,
      .table-container {
        padding: 16px;
      }

      .visualization-container {
        flex: 2;
      }

      .table-container {
        flex: 3;
      }
    }

    .right-section {
      flex: 3;
      display: flex;
      flex-direction: column;
      padding: 16px;
      overflow: hidden;

      h3 {
        flex-shrink: 0;
      }

      .control-panel {
        flex: 1;
        overflow: auto;
      }
    }
  }
}
</style>
