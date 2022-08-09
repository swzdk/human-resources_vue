<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <PageTool>
        <template v-slot:after>
          <el-button type="primary" size="small" @click="addPermission('0',1)">添加权限</el-button>
        </template>
      </PageTool>
      <!-- 表格 -->
      <el-table border :data="list" row-key="id">
        <el-table-column align="center" label="名称" prop="name" />
        <el-table-column align="center" label="标识" prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="center" label="操作">
          <template v-slot="{row}">
            <el-button type="text" @click="addPermission(row.id,2)" v-if="row.type!==2">添加</el-button>
            <el-button type="text" @click="updatePermission(row.id)">编辑</el-button>
            <el-button type="text" @click="delPermission(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 放置一个弹层 用来编辑新增节点 -->
      <el-dialog :title="`${showText}权限点`" :visible="showDialog" @close="close">
        <!-- 表单 -->
        <el-form ref="form" :model="formData" :rules="rules" label-width="120px">
          <el-form-item label="权限名称" prop="name">
            <el-input v-model="formData.name" style="width:90%" />
          </el-form-item>
          <el-form-item label="权限标识" prop="code">
            <el-input v-model="formData.code" style="width:90%" />
          </el-form-item>
          <el-form-item label="权限描述">
            <el-input v-model="formData.description" style="width:90%" />
          </el-form-item>
          <el-form-item label="开启">
            <el-switch v-model="formData.enVisible" active-value="1" inactive-value="0" />
          </el-form-item>
        </el-form>
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" type="primary" @click="confirm">确定</el-button>
            <el-button size="small" @click="close">取消</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getPermissionList,
  addPermission,
  delPermission,
  updatePermission,
  getPermissionDetail
} from '@/api/permission.js'
import { getChildrenArrayByID } from '@/utils/index'
export default {
  name: 'Permission',
  data() {
    return {
      list: [],
      // 控制弹层开关
      showDialog: false,
      // 表格数据
      formData: {
        name: '',
        code: '',
        description: '',
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      // 规则
      rules: {
        name: [
          {
            required: true,
            message: '权限名称不能为空'
          }
        ],
        code: [
          {
            required: true,
            message: '权限标识不能为空'
          }
        ],
        description: ''
      }
    }
  },
  computed: {
    showText() {
      return this.formData.id ? '编辑' : '新增'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async updatePermission(id) {
      const res = await getPermissionDetail(id)
      this.formData = res
      this.showDialog = true
    },
    async delPermission(id) {
      await this.$confirm('确定要删除该数据吗')
      await delPermission(id)
      this.getPermissionList()
      this.$message.success('删除成功')
    },
    async getPermissionList() {
      const res = await getPermissionList()
      // 转成树形结构
      this.list = getChildrenArrayByID(res, '0')
    },
    close() {
      this.$refs.form.resetFields()
      this.formData = {
        name: '',
        code: '',
        description: '',
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      this.showDialog = false
    },
    addPermission(pid, type) {
      this.formData.pid = pid
      this.formData.type = type
      this.showDialog = true
    },
    async confirm() {
      await this.$refs.form.validate()
      if (!this.formData.id) {
        await addPermission(this.formData)
      } else {
        await updatePermission(this.formData)
      }
      this.$message.success('添加权限点成功！')
      this.getPermissionList()
      this.close()
    }
  }
}
</script>
