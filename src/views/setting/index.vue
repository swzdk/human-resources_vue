<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs v-model="activeName">
          <el-tab-pane label="角色管理" name="first">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="small"
              style="margin-bottom:30px"
              @click="showDialog= true"
            >新增角色</el-button>
            <el-table :data="list" border style="width: 100%">
              <el-table-column type="index" label="序号" width="180"></el-table-column>
              <el-table-column prop="name" label="角色名称" width="180"></el-table-column>
              <el-table-column prop="description" label="描述"></el-table-column>
              <el-table-column label="操作">
                <template v-slot="{ row }">
                  <el-button type="success" size="small" @click="assignPerm(row.id)">分配权限</el-button>
                  <el-button type="primary" size="small" @click="editRole(row)">编辑</el-button>
                  <el-button type="danger" size="small" @click="deleteRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row style="display:flex; justify-content:center; margin-top:20px">
              <el-pagination
                background
                layout="prev, pager, next"
                :total="total"
                :current-page="query.page"
                :page-size="query.pagesize"
                @current-change="currentChange"
              ></el-pagination>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息" name="second">
            <el-alert title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改" type="info" show-icon></el-alert>
            <el-form label-width="120px" disabled style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input :placeholder="formData.name" style="width:32%"></el-input>
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input :placeholder="formData.companyAddress" style="width:32%"></el-input>
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input :placeholder="formData.mailbox" style="width:32%"></el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input type="textarea" :placeholder="formData.remarks" style="width:32%"></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <el-dialog :title="`${title}弹层`" :visible="showDialog" @close="close">
        <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="roleForm.name" />
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="roleForm.description" />
          </el-form-item>
        </el-form>
        <!-- 底部 -->
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" @click="close">取消</el-button>
            <el-button size="small" type="primary" @click="submit">确定</el-button>
          </el-col>
        </el-row>
      </el-dialog>
      <!-- 分配权限 -->
      <el-dialog :visible.sync="permShowDialog" title="分配权限" @close="closePermission">
        <template #footer>
          <el-tree
            show-checkbox
            :props="props"
            node-key="id"
            :default-checked-keys="checkedList"
            :data="permissionList"
            ref="tree"
          />
          <el-row>
            <el-button size="mini" type="primary" @click="btnOK">确认</el-button>
            <el-button size="mini" @click="closePermission">取消</el-button>
          </el-row>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getRoleList,
  getCompanyInfo,
  deleteRole,
  updateRole,
  addRole,
  getRoleDetail,
  assignPerm
} from '@/api/setting'
import { getPermissionList } from '@/api/permission'
import { getChildrenArrayByID } from '@/utils/index'
export default {
  data() {
    return {
      activeName: 'second',
      query: {
        page: 1,
        pagesize: 2
      },
      list: [],
      total: 0,
      formData: {},
      showDialog: false,
      permShowDialog: false,
      currentID: '',
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: '用户名不能为空'
          }
        ]
      },
      permissionList: [],
      checkedList: [],
      props: {
        label: 'name'
      }
    }
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    async btnOK() {
      // 获取树型选中的选项
      const checkedList = this.$refs.tree.getCheckedNodes()
      await assignPerm({
        id: this.currentID,
        permIds: checkedList
      })
      this.$message.success('更新权限成功！')
      this.closePermission()
    },
    closePermission() {
      // this.checkedList = []
      this.permShowDialog = false
    },
    async assignPerm(id) {
      this.currentID = id
      // 获取权限信息 转换树形结构
      this.permissionList = getChildrenArrayByID(await getPermissionList(), '0')
      // 获取当前角色已有权限
      const { permIds } = await getRoleDetail(id)
      // 赋值给选中数组
      this.checkedList = permIds
      this.permShowDialog = true
    },
    async getRoleList() {
      const { rows, total } = await getRoleList(this.query)
      this.list = rows
      this.total = total
    },
    currentChange(page) {
      this.query.page = page
      this.getRoleList()
    },
    async getCompanyInfo() {
      const res = await getCompanyInfo(this.$store.getters.companyId)
      this.formData = res
    },
    async deleteRole(id) {
      // 删除前判断,如果长度为1并且当前页不为1，page-1
      if (this.list.length === 1 && this.query.page !== 1) {
        this.query.page--
      }
      await this.$confirm('确认删除该角色吗')
      await deleteRole(id)
      this.$message.success('删除成功！')
      this.getRoleList()
    },
    editRole(row) {
      this.showDialog = true
      this.roleForm = row
    },
    close() {
      this.showDialog = false
      this.$refs.roleForm.resetFields()
      this.roleForm = {
        name: '',
        description: ''
      }
    },
    async submit() {
      this.$refs.roleForm.validate()
      if (this.roleForm.id) {
        await updateRole(this.roleForm)
      } else {
        await addRole(this.roleForm)
      }
      this.getRoleList()
      this.$message.success('修改成功')
      this.close()
    }
  },
  computed: {
    title() {
      return this.roleForm.id ? '修改' : '新增'
    }
  }
}
</script>

<style>
</style>

