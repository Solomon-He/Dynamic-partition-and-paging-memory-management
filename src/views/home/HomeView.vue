<script setup>
import { useRouter } from 'vue-router'
import { Monitor, Files } from '@element-plus/icons-vue'

const router = useRouter()
</script>

<template>
  <div class="home-container">
    <h1 class="home-title">内存管理模拟系统</h1>

    <div class="module-cards">
      <el-card class="module-card" @click="router.push('/partition')">
        <template #header>
          <div class="card-header">
            <h2>动态分区管理</h2>
          </div>
        </template>
        <div class="card-content">
          <el-icon class="card-icon"><Monitor /></el-icon>
          <ul class="feature-list">
            <li>最先适应算法</li>
            <li>最佳适应算法</li>
            <li>最坏适应算法</li>
            <li>内存分配可视化</li>
            <li>分区表实时更新</li>
          </ul>
        </div>
      </el-card>

      <el-card class="module-card" @click="router.push('/paging')">
        <template #header>
          <div class="card-header">
            <h2>动态分页管理</h2>
          </div>
        </template>
        <div class="card-content">
          <el-icon class="card-icon"><Files /></el-icon>
          <ul class="feature-list">
            <li>请求式分页管理</li>
            <li>FIFO页面置换</li>
            <li>地址转换</li>
            <li>页表状态监控</li>
            <li>缺页中断处理</li>
          </ul>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home-container {
  padding: 2rem;
  text-align: center;

  .home-title {
    font-size: 2.5rem;
    color: var(--el-text-color-primary);
    margin-bottom: 3rem;
  }

  .module-cards {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-top: 2rem;

    .module-card {
      width: 300px;
      cursor: pointer;
      transition: transform 0.3s ease;

      &:hover {
        transform: translateY(-5px);
      }

      .card-header {
        text-align: center;
        h2 {
          margin: 0;
          color: var(--el-text-color-primary);
        }
      }

      .card-content {
        padding: 1rem;

        .card-icon {
          font-size: 3rem;
          color: var(--el-color-primary);
          margin-bottom: 1rem;
        }

        .feature-list {
          text-align: left;
          list-style: none;
          padding: 0;

          li {
            margin: 0.5rem 0;
            color: var(--el-text-color-regular);

            &::before {
              content: '✓';
              color: var(--el-color-success);
              margin-right: 0.5rem;
            }
          }
        }
      }
    }
  }
}
</style>
