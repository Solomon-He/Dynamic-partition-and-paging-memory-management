<script setup>
import { ref } from 'vue'
import { usePartitionStore } from '@/stores/partition'
import { Setting, Operation, Plus, Check, Refresh, CirclePlus } from '@element-plus/icons-vue'

const store = usePartitionStore()

// 内存配置相关
const totalMemory = ref(store.totalMemory)
const osSize = ref(store.osSize)

// 分配算法选择
const algorithmOptions = [
  { label: '最先适应算法', value: 'first-fit' },
  { label: '最佳适应算法', value: 'best-fit' },
  { label: '最坏适应算法', value: 'worst-fit' },
]
const selectedAlgorithm = ref(store.algorithm)

// 进程创建相关
const processForm = ref({
  size: 1,
  duration: null, // 可选的持续时间
})

// 验证规则
const validateMemorySize = (rule, value, callback) => {
  if (value < osSize.value) {
    callback(new Error('总内存不能小于操作系统占用大小'))
  } else if (value < 1) {
    callback(new Error('内存大小必须大于0'))
  } else {
    callback()
  }
}

const validateOSSize = (rule, value, callback) => {
  if (value < 1) {
    callback(new Error('操作系统占用大小必须大于0'))
  } else if (value > totalMemory.value) {
    callback(new Error('操作系统占用不能大于总内存'))
  } else {
    callback()
  }
}

const validateProcessSize = (rule, value, callback) => {
  if (value < 1) {
    callback(new Error('进程大小必须大于0'))
  } else if (value > store.availableMemory) {
    callback(new Error(`进程大小不能大于可用内存(${store.availableMemory}KB)`))
  } else {
    callback()
  }
}

const validateProcessDuration = (rule, value, callback) => {
  if (value !== null && (value < 1 || value > 60)) {
    // 假设最大允许60秒
    callback(new Error('持续时间必须在1-60秒之间'))
  } else {
    callback()
  }
}

const rules = {
  totalMemory: [
    { required: true, message: '请输入总内存大小', trigger: 'blur' },
    { validator: validateMemorySize, trigger: 'blur' },
  ],
  osSize: [
    { required: true, message: '请输入操作系统占用大小', trigger: 'blur' },
    { validator: validateOSSize, trigger: 'blur' },
  ],
  size: [
    { required: true, message: '请输入进程大小', trigger: 'blur' },
    { validator: validateProcessSize, trigger: ['blur', 'change'] },
  ],
  duration: [{ validator: validateProcessDuration, trigger: 'blur' }],
}

// 表单引用
const formRef = ref(null)
const processFormRef = ref(null)

// 应用配置
const applySettings = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    store.updateMemorySettings(totalMemory.value, osSize.value)
    store.updateAlgorithm(selectedAlgorithm.value)
    ElMessage.success('配置已更新')
  } catch (error) {
    ElMessage.error(error.message || '请检查配置是否正确')
  }
}

// 重置配置
const resetSettings = () => {
  if (!formRef.value) return
  store.resetSystem()
  totalMemory.value = store.totalMemory
  osSize.value = store.osSize
  selectedAlgorithm.value = store.algorithm
  ElMessage.success('系统已重置')
}

// 创建进程
const createProcess = async () => {
  if (!processFormRef.value) return

  try {
    await processFormRef.value.validate()
    store.createProcess(processForm.value.size, processForm.value.duration)
    processForm.value = { size: 1, duration: null } // 重置表单
    ElMessage.success('进程创建成功')
  } catch (error) {
    ElMessage.error(error.message || '创建进程失败')
  }
}
</script>

<template>
  <div class="control-panel">
    <!-- 系统配置表单 -->
    <el-form
      ref="formRef"
      :model="{ totalMemory, osSize }"
      :rules="rules"
      label-position="top"
      class="config-form"
    >
      <el-divider>
        <el-icon><Setting /></el-icon>
        系统配置
      </el-divider>

      <el-form-item label="总内存大小 (KB)" prop="totalMemory">
        <el-input-number
          v-model="totalMemory"
          :min="1"
          :max="1024"
          :step="1"
          controls-position="right"
        />
      </el-form-item>

      <el-form-item label="操作系统占用 (KB)" prop="osSize">
        <el-input-number
          v-model="osSize"
          :min="1"
          :max="totalMemory"
          :step="1"
          controls-position="right"
        />
      </el-form-item>

      <el-divider>
        <el-icon><Operation /></el-icon>
        分配算法
      </el-divider>

      <el-form-item>
        <el-radio-group v-model="selectedAlgorithm" class="algorithm-group">
          <el-radio
            v-for="option in algorithmOptions"
            :key="option.value"
            :value="option.value"
            border
          >
            {{ option.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <div class="button-group">
        <el-button type="primary" @click="applySettings" :icon="Check"> 应用配置 </el-button>
        <el-button @click="resetSettings" :icon="Refresh"> 重置系统 </el-button>
      </div>
    </el-form>

    <!-- 进程创建表单 -->
    <el-form
      ref="processFormRef"
      :model="processForm"
      :rules="rules"
      label-position="top"
      class="process-form"
    >
      <el-divider>
        <el-icon><Plus /></el-icon>
        创建进程
      </el-divider>

      <el-form-item label="进程大小 (KB)" prop="size">
        <el-input-number
          v-model="processForm.size"
          :min="1"
          :max="store.availableMemory"
          :step="1"
          controls-position="right"
        />
      </el-form-item>

      <el-form-item label="持续时间 (秒)" prop="duration">
        <el-input-number
          v-model="processForm.duration"
          :min="1"
          :max="60"
          :step="1"
          controls-position="right"
          placeholder="不填则随机生成5-20秒"
        />
      </el-form-item>

      <el-button type="success" @click="createProcess" class="create-button" :icon="CirclePlus">
        创建进程
      </el-button>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.control-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding-right: 8px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--el-border-color-lighter);
    border-radius: 3px;
  }

  .config-form,
  .process-form {
    background-color: var(--el-bg-color-overlay);
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 20px;
    box-shadow: var(--el-box-shadow-lighter);
  }

  :deep(.el-divider) {
    margin: 16px 0;

    .el-divider__content {
      font-size: 16px;
      font-weight: 600;
      color: var(--el-text-color-primary);

      .el-icon {
        margin-right: 8px;
        vertical-align: middle;
      }
    }
  }

  .algorithm-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;

    :deep(.el-radio) {
      height: 40px;
      margin: 0;
      padding: 0 16px;

      &.is-bordered {
        border-color: var(--el-border-color-lighter);

        &.is-checked {
          border-color: var(--el-color-primary);
        }
      }

      .el-radio__label {
        font-size: 14px;
      }
    }
  }

  .button-group {
    display: flex;
    gap: 12px;
    margin-top: 24px;

    .el-button {
      flex: 1;

      .el-icon {
        margin-right: 4px;
      }
    }
  }

  .create-button {
    width: 100%;
    margin-top: 8px;
    height: 40px;

    .el-icon {
      margin-right: 4px;
    }
  }

  :deep(.el-form-item) {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }

    .el-form-item__label {
      padding-bottom: 8px;
      font-weight: 500;
      color: var(--el-text-color-regular);
    }
  }

  :deep(.el-input-number) {
    width: 100%;

    .el-input__wrapper {
      padding-right: 0;
    }
  }
}
</style>
