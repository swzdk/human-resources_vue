<template>
  <el-dialog :title="title" :visible="dialogVisible" @close="close">
    <el-form label-width="120px" :rules="rules" :model="formData" ref="form">
      <el-form-item label="部门名称" prop="name">
        <el-input style="width:80%" placeholder="1-50个字符" v-model="formData.name" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input style="width:80%" placeholder="1-50个字符" v-model="formData.code" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          style="width:80%"
          placeholder="请选择"
          v-model="formData.manager"
          @focus="getEmployeeSimple"
        >
          <el-option v-for="item in options" :key="item.id" :value="item.username"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          style="width:80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
          v-model="formData.introduce"
        />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small" @click="submit">确定</el-button>
        <el-button size="small" @click="close">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import {
  getDepartments,
  addDepartments,
  getDepartDetail,
  updateDepartments
} from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  name: 'AddDept',
  props: {
    dialogVisible: {
      type: Boolean,
      required: true
    },
    currentNode: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      rules: {
        name: [
          {
            required: true,
            message: '部门名称不能为空'
          },
          {
            min: 1,
            max: 50,
            message: '部门名称1-50'
          },
          {
            trigger: 'blur',
            validator: this.checkNameRepeat
          }
        ],
        code: [
          {
            required: true,
            message: '部门编码不能为空'
          },
          {
            min: 1,
            max: 50,
            message: '部门编码1-50'
          },
          {
            trigger: 'blur',
            validator: this.checkCodeRepeat
          }
        ],
        manager: [
          {
            required: true,
            message: '部门管理者不能为空'
          }
        ],
        introduce: [
          {
            required: true,
            message: '部门介绍不能为空'
          },
          {
            min: 1,
            max: 300,
            message: '部门介绍1-300'
          }
        ]
      },
      options: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        },
        {
          value: '选项3',
          label: '蚵仔煎'
        },
        {
          value: '选项4',
          label: '龙须面'
        },
        {
          value: '选项5',
          label: '北京烤鸭'
        }
      ],
      value: ''
    }
  },
  methods: {
    async checkNameRepeat(rule, value) {
      let childrenNodes = null
      const { depts } = await getDepartments()
      // 判断是否有id来确定是编辑还是新增
      if (this.formData.id) {
        // 找到同级节点不包含自身
        childrenNodes = depts.filter(
          (item) =>
            item.pid === this.currentNode.pid && item.id !== this.currentNode.id
        )
      } else {
        // 找到子节点
        childrenNodes = depts.filter((item) => item.pid === this.currentNode.id)
      }
      // 判断子部门中是否有名字和输入名字相同的
      const isRepeat = childrenNodes.some((item) => item.name === value)
      if (isRepeat) {
        return Promise.reject('部门名称重复')
      }
    },
    async checkCodeRepeat(rule, value) {
      const { depts } = await getDepartments()
      // 判断所有部门中是否有code和输入code相同的
      const isRepeat = depts.some(
        (item) => item.code === value && item.id !== this.currentNode.id
      )
      if (isRepeat) {
        return Promise.reject('部门编码重复')
      }
    },
    async getEmployeeSimple() {
      const res = await getEmployeeSimple()
      this.options = res
    },
    async submit() {
      // 点击提交时校验表单（防止用户直接提交）
      await this.$refs.form.validate()
      // 如果有id,执行编辑流程
      if (this.formData.id) {
        await updateDepartments(this.formData)
      } else {
        // 将表单内容和部门id传入
        await addDepartments({
          ...this.formData,
          pid: this.currentNode.id
        })
      }
      const title = this.title
      this.$emit('getDepartments')
      this.close()
      this.$message.success(`${title}成功！`)
    },
    close() {
      // 清除表单数据
      this.$refs.form.resetFields()
      this.formData = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
      // 通知父组件关闭弹层
      this.$emit('update:dialogVisible', false)
    },
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id)
    }
  },
  computed: {
    title() {
      return (
        (this.formData.id ? '编辑' : '新增') + `【${this.currentNode.name}】`
      )
    }
  }
}
</script>

<style>
</style>
