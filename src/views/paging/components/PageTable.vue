<script setup>
import { usePagingStore } from '@/stores/paging'
import { storeToRefs } from 'pinia'

const store = usePagingStore()
const { pageTable } = storeToRefs(store)
</script>

<template>
  <div class="page-table">
    <h3>页表状态</h3>
    <div class="table-container">
      <el-table :data="pageTable" size="small" border>
        <el-table-column prop="pageNo" label="页号" width="80" align="center" />

        <el-table-column label="标志" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.flag ? 'success' : 'info'" size="small" effect="plain">
              {{ row.flag ? '1' : '0' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="内存块号" width="80" align="center">
          <template #default="{ row }">
            <span v-if="row.flag">{{ row.frameNo }}</span>
            <span v-else class="empty-cell">-</span>
          </template>
        </el-table-column>

        <el-table-column label="修改标志" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.modified ? 'warning' : 'info'" size="small" effect="plain">
              {{ row.modified ? '1' : '0' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="在磁盘上的位置" min-width="120" align="center">
          <template #default="{ row }">
            {{ row.diskPosition }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-table {
  height: 100%;
  display: flex;
  flex-direction: column;

  h3 {
    margin: 0 0 12px;
    font-size: 14px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  .table-container {
    flex: 1;
    overflow: hidden;
  }

  :deep(.el-table) {
    // height: 100%;
    --el-table-border-color: var(--el-border-color-lighter);

    .el-table__header-wrapper {
      th {
        background-color: var(--el-fill-color-light);
        font-size: 13px;
        font-weight: 600;
        height: 40px;
        padding: 4px 0;
      }
    }

    .el-table__body-wrapper {
      td {
        font-size: 13px;
        height: 36px;
        padding: 4px 0;
      }
    }

    .empty-cell {
      color: var(--el-text-color-secondary);
    }
  }

  :deep(.el-tag) {
    width: 40px;
    justify-content: center;

    &.el-tag--primary {
      width: auto;
    }
  }
}
</style>
