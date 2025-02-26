<script setup>
import { usePartitionStore } from '@/stores/partition'
import { storeToRefs } from 'pinia'

const store = usePartitionStore()
const { freePartitions, occupiedPartitions } = storeToRefs(store)
</script>

<template>
  <div class="partition-table">
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
        <el-table-column prop="processId" label="进程" />
        <el-table-column prop="status" label="状态">
          <template #default>
            <el-tag type="danger">占用</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.partition-table {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;

  .table-section {
    h4 {
      margin: 0 0 12px;
      color: var(--el-text-color-regular);
      font-size: 14px;
      font-weight: 500;
    }

    :deep(.el-table) {
      --el-table-border-color: var(--el-border-color-lighter);

      .el-table__cell {
        padding: 8px;
      }
    }
  }
}
</style>
