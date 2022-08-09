<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <TreeTool :data="company" @handleAddDepts="handleAddDepts" />
      </el-card>
      <el-tree
        class="tree-list"
        :default-expand-all="true"
        :data="departs"
        :props="defaultProps"
        v-loading="isLoading"
      >
        <template v-slot="{data}">
          <TreeTool
            :isRoot="true"
            :data="data"
            @getData="getDepartments"
            @handleAddDepts="handleAddDepts"
            @handleEditDepts="handleEditDepts"
          />
        </template>
      </el-tree>
    </div>
    <AddDept
      :dialogVisible.sync="showDialog"
      :currentNode="currentNode"
      @getDepartments="getDepartments"
      ref="addDept"
    />
  </div>
</template>

<script>
import AddDept from './components/add-dept'
import { getDepartments } from '@/api/departments'
import TreeTool from './components/tree-tools.vue'
export default {
  components: {
    TreeTool,
    AddDept
  },
  data() {
    return {
      isLoading: false,
      currentNode: {},
      company: { name: '', manager: '', id: '' },
      departs: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      showDialog: false // 显示窗体
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    // getChildrenArray(array, rootId) {
    //   // 创建数组
    //   const arr = []
    //   // 遍历查找
    //   array.forEach((item) => {
    //     if (item.pid === rootId) {
    //       // 如果确定是父节点，在往下查找，传入的节点即当前父节点id
    //       const childrenArr = this.getChildrenArray(array, item.id)
    //       item.children = childrenArr
    //       arr.push(item)
    //     }
    //   })
    //   return arr
    // }
    async getDepartments() {
      const res = await getDepartments()
      this.company.name = res.companyName
      this.company.manager = res.companyManage || '管理员'
      // this.departs = this.getChildrenArray(res.depts, '')
      this.departs = this.getChildrenArray(res.depts)
    },
    getChildrenArray(array) {
      // 构建要返回的数组
      const arr = []
      const map = {}
      // 初步构建map结构
      array.forEach((item) => {
        if (!item.children) {
          // 添加children数组
          item.children = []
        }
        map[item.id] = item
      })
      array.forEach((item) => {
        // 子项有pid指向的即为父结构
        const parent = map[item.pid]
        // 如果map结构中存在，添加进去
        if (parent) {
          parent.children.push(item)
        } else {
          // 如果不存在pid，说明item自己就是父结构
          arr.push(item)
        }
      })
      return arr
    },
    handleAddDepts(clickNode) {
      this.showDialog = true
      this.currentNode = clickNode
    },
    handleEditDepts(clickNode) {
      this.showDialog = true
      this.currentNode = clickNode
      this.$refs.addDept.getDepartDetail(clickNode.id)
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  width: 80%;
  margin: 0 auto;
}
.app-container {
  width: 100%;
}
.tree-card {
  width: 898px;
  margin: 0 auto;
  font-size: 14px;
  background: #9cf;
  color: #036;
}
.tree-list {
  width: 898px;
  margin: 0 auto;
}
/* .treeItem {
  width: 898px;
  height: 50px;
}
.treeItem .el-card__body {
  margin: 0;
  padding: 0;
} */
</style>

