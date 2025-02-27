<script setup>
import { ref } from 'vue'
import { usePagingStore } from '@/stores/paging'
import { Operation, Plus, Refresh, MagicStick } from '@element-plus/icons-vue'

const store = usePagingStore()

// 指令创建表单
const instructionForm = ref({
  operation: '+',
  pageNo: null, // 改为 null 表示未指定
  offset: null, // 改为 null 表示未指定
})

// 验证规则
const validatePageNo = (rule, value, callback) => {
  if (value < 0 || value > 6) {
    callback(new Error('页号必须在0-6之间'))
  } else {
    callback()
  }
}

const validateOffset = (rule, value, callback) => {
  if (value < 0 || value > 1023) {
    callback(new Error('页内偏移必须在0-1023之间'))
  } else {
    callback()
  }
}

const rules = {
  pageNo: [
    { required: true, message: '请输入页号', trigger: 'blur' },
    { validator: validatePageNo, trigger: 'blur' },
  ],
  offset: [
    { required: true, message: '请输入页内偏移', trigger: 'blur' },
    { validator: validateOffset, trigger: 'blur' },
  ],
}

// 表单引用
const formRef = ref(null)

// 添加并执行指令
const addInstruction = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    // 获取指令参数，如果未指定则随机生成
    const randomValues = store.generateRandomInstruction()
    const instruction = store.addInstruction(
      instructionForm.value.operation || randomValues.operation,
      instructionForm.value.pageNo ?? randomValues.pageNo,
      instructionForm.value.offset ?? randomValues.offset,
    )

    // 立即执行指令
    const result = store.executeInstruction(instruction)

    ElMessage.success(
      `指令执行成功：${instruction.operation} ，物理地址 ${result.physicalAddress}${
        result.pageFault ? '，发生缺页中断' : '，不缺页'
      }`,
    )
  } catch (error) {
    ElMessage.error(error.message || '指令创建失败')
  }
}

// 生成随机指令
const generateRandomInstruction = () => {
  const randomValues = store.generateRandomInstruction()
  instructionForm.value = {
    operation: randomValues.operation,
    pageNo: randomValues.pageNo,
    offset: randomValues.offset,
  }
}

// 重置系统
const resetSystem = () => {
  store.resetSystem()
  instructionForm.value = {
    operation: '+',
    pageNo: null,
    offset: null,
  }
  ElMessage.success('系统已重置')
}
</script>

<template>
  <div class="control-panel">
    <el-form
      ref="formRef"
      :model="instructionForm"
      :rules="rules"
      label-position="top"
      class="instruction-form"
    >
      <el-divider>
        <el-icon><Operation /></el-icon>
        创建指令
      </el-divider>

      <el-form-item label="操作类型">
        <el-select v-model="instructionForm.operation" class="operation-select" clearable>
          <el-option v-for="op in store.operationTypes" :key="op" :label="op" :value="op" />
        </el-select>
      </el-form-item>

      <el-form-item label="页号" prop="pageNo">
        <el-input-number
          v-model="instructionForm.pageNo"
          :min="0"
          :max="6"
          :step="1"
          controls-position="right"
          clearable
        />
      </el-form-item>

      <el-form-item label="页内偏移" prop="offset">
        <el-input-number
          v-model="instructionForm.offset"
          :min="0"
          :max="1023"
          :step="1"
          controls-position="right"
          clearable
        />
      </el-form-item>

      <div class="button-group">
        <el-button type="primary" @click="addInstruction" :icon="Plus"> 创建并执行指令 </el-button>
        <el-button type="success" @click="generateRandomInstruction" :icon="MagicStick">
          随机生成
        </el-button>
        <el-button @click="resetSystem" :icon="Refresh"> 重置系统 </el-button>
      </div>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.control-panel {
  padding: 20px;

  .instruction-form {
    .el-divider {
      margin: 24px 0;

      :deep(.el-divider__text) {
        font-size: 14px;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }
    }

    .operation-select {
      width: 100%;
    }

    .el-form-item {
      margin-bottom: 20px;
    }

    .button-group {
      display: flex;
      gap: 12px;
      margin-top: 24px;
    }
  }
}
</style>
