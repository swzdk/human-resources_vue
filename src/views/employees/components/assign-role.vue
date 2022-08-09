<template>
  <el-dialog title="提示" :visible="showDialog" @close="close">
    <el-checkbox-group v-model="checkList" v-loading="loading">
      <el-checkbox :label="item.id" v-for="item in list" :key="item.id">{{item.name}}</el-checkbox>
    </el-checkbox-group>
    <template #footer>
      <el-button type="primary" @click="confirm">确认</el-button>
      <el-button @click="close">取消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/employees'
import { assignRoles } from '@/api/user'
export default {
  name: 'AssignRole',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      checkList: [],
      list: [],
      loading: false,
      currentID: null
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async confirm() {
      await assignRoles({
        id: this.currentID,
        roleIds: this.checkList
      })
      this.$message.success('修改权限成功！')
      this.close()
    },
    close() {
      this.checkList = []
      this.$emit('update:showDialog', false)
    },
    async getRoleList() {
      const { rows } = await getRoleList()
      this.list = rows
    },
    async getUserDetailById(id) {
      this.loading = true
      this.currentID = id
      const res = await getUserDetailById(id)
      this.checkList = res.roleIds
      this.loading = false
    }
  }
}
</script>

<style>
</style>
