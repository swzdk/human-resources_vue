<template>
  <div class="dashboard-container">
    <PageTool>
      <template #before>
        <span>共100条数据</span>
      </template>
      <template #after>
        <el-button size="mini" type="primary" @click="$router.push('/import')">导入</el-button>
        <el-button size="mini" type="danger" @click="exportData">导出</el-button>
        <el-button size="mini" type="warning" @click="showDialog=true">新增员工</el-button>
      </template>
    </PageTool>
    <el-card v-loading="loading">
      <el-table border :data="list">
        <el-table-column label="序号" sortable type="index" />
        <el-table-column label="姓名" sortable prop="username" />
        <el-table-column label="头像" width="140px" align="center">
          <template v-slot="{row}">
            <el-avatar :src="row.staffPhoto" :size="80" @click.native="showQrCode(row.staffPhoto)"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column label="工号" sortable prop="workNumber" />
        <el-table-column
          label="聘用形式"
          sortable
          :formatter="formatEmployment"
          prop="formOfEmployment"
        />
        <el-table-column label="部门" sortable prop="departmentName" />
        <el-table-column label="入职时间" sortable prop="timeOfEntry">
          <template v-slot="{row}">{{row.timeOfEntry | formatDate }}</template>
        </el-table-column>
        <el-table-column label="账户状态" sortable prop="enableState" />
        <el-table-column label="操作" sortable fixed="right" width="280">
          <template v-slot="{row}">
            <el-button
              type="text"
              size="small"
              @click="$router.push(`/employees/details/${row.id}`)"
            >查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small" @click="checkRole(row.id)">角色</el-button>
            <el-button type="text" size="small" @click="deleteEmp(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-row type="flex" justify="center" align="middle" style="height: 60px">
        <el-pagination
          layout="prev, pager, next"
          :page-size="page.size"
          :current-page="page.page"
          :total="page.total"
          @current-change="changePage"
        />
      </el-row>
    </el-card>
    <!-- 二维码弹层 -->
    <el-dialog title="二维码" :visible.sync="showCodeDialog">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
    <!-- 分配员工权限弹层 -->
    <AssignRole :showDialog.sync="showAssignRoleDialog" ref="roleRef" />
    <AddDemployee :showDialog.sync="showDialog" />
  </div>
</template>

<script>
import QrCode from 'qrcode'
import EmployeeEnum from '@/api/constant/employees'
import AddDemployee from './components/add-employee'
import { getEmployeeList, delEmployee } from '@/api/employees'
import AssignRole from './components/assign-role.vue'
export default {
  components: {
    AddDemployee,
    AssignRole
  },
  data() {
    return {
      loading: false,
      list: [], // 接数据的
      page: {
        page: 1, // 当前页码
        size: 10,
        total: 0 // 总数
      },
      showDialog: false,
      showCodeDialog: false,
      showAssignRoleDialog: false
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    checkRole(id) {
      // 调用子组件中的查看角色详情方法
      this.$refs.roleRef.getUserDetailById(id)
      this.showAssignRoleDialog = true
    },
    showQrCode(url) {
      if (url) {
        this.showCodeDialog = true // 数据更新了 但是我的弹层会立刻出现吗 ？页面的渲染是异步的！！！！
        // 有一个方法可以在上一次数据更新完毕，页面渲染完毕之后
        this.$nextTick(() => {
          console.log(QrCode)
          // 此时可以确认已经有ref对象了
          QrCode.toCanvas(this.$refs.myCanvas, url) // 将地址转化成二维码
          // 如果转化的二维码后面信息 是一个地址的话 就会跳转到该地址 如果不是地址就会显示内容
        })
      } else {
        this.$message.warning('该用户还未上传头像')
      }
    },
    changePage(newPage) {
      this.page.page = newPage
      this.getEmployeeList()
    },
    async getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    formatEmployment(row, column, value) {
      const newValue = EmployeeEnum.hireType.find(
        (item) => item.id === value
      )?.value
      return newValue || '未知'
    },
    async deleteEmp(id) {
      try {
        await this.$confirm('您确定删除该员工吗')
        await delEmployee(id)
        this.getEmployeeList()
        this.$message.success('删除员工成功')
      } catch (error) {
        console.log(error)
      }
    },
    async exportData() {
      // const { export_json_to_excel } = await import('vendor/Export2Excel')
      // const tHeader = ['id', '标题', '作者']
      // export_json_to_excel({
      //   header: tHeader, // 表头 必填
      //   data: [
      //     [1, '喝茶吗', '老大'],
      //     [2, '喝茶吗额', '小三'],
      //     [3, '喝茶吗4', '老六']
      //   ], // 具体数据 必填
      //   filename: 'excel-list', // 非必填
      //   autoWidth: true, // 非必填
      //   bookType: 'xlsx' // 非必填
      // })
    }
  }
}
</script>

<style lang="scss">
.page-tools {
  margin: 10px 0;
  .before {
    line-height: 34px;
    i {
      margin-right: 5px;
      color: #409eff;
    }
    display: inline-block;
    padding: 0px 10px;
    border-radius: 3px;
    border: 1px solid rgba(145, 213, 255, 1);
    background: rgba(230, 247, 255, 1);
  }
}
</style>

