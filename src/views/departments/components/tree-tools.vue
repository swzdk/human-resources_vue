<template>
  <!-- 用了一个行列布局 -->
  <el-row type="flex" justify="space-between" align="middle" style="height: 30px; width:100%">
    <el-col>
      <span>{{ data.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <!-- 两个内容 -->
        <el-col>{{ data.manager }}</el-col>
        <el-col>
          <!-- 下拉菜单 element -->
          <el-dropdown @command="itemClick">
            <span>
              操作
              <i class="el-icon-arrow-down" />
            </span>
            <!-- 下拉菜单 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加部门</el-dropdown-item>
              <el-dropdown-item v-if="isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="isRoot" command="delete">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'
export default {
  name: 'TreeTool',
  props: {
    // 定义一个props属性
    data: {
      type: Object, // 对象类型
      required: true // 要求对方使用您的组件的时候 必须传treeNode属性 如果不传 就会报错
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    async itemClick(type) {
      if (type === 'add') {
        // 点击添加时把当前点击的节点数据一并传过去
        this.$emit('handleAddDepts', this.data)
      } else if (type === 'edit') {
        this.$emit('handleEditDepts', this.data)
      } else {
        await this.$confirm('确认删除？')
        await delDepartments(this.data.id)
        this.$emit('getData')
      }
    }
  }
}
</script>

<style>
</style>
