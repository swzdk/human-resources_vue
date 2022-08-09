<template>
  <div>
    <el-card class="container">
      <el-tabs>
        <el-tab-pane label="登录账号设置">
          <el-form
            ref="formRef"
            :model="form"
            :rules="rules"
            label-width="120px"
            style="margin-top:30px"
          >
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.username" style="width:40%"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password2">
              <el-input v-model="form.password2" style="width:40%"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="updateData">更新</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="个人详情">
          <component :is="userInfo" />
        </el-tab-pane>
        <el-tab-pane label="岗位信息">
          <component :is="jobInfo" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { getUserDetailById, saveUserDetailById } from '@/api/employees'
import UserInfo from './user-info.vue'
import JobInfo from './job-info.vue'
export default {
  components: {
    UserInfo,
    JobInfo
  },
  data() {
    return {
      userInfo: UserInfo,
      jobInfo: JobInfo,
      form: {
        username: '',
        password2: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入姓名'
          }
        ],
        password2: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 16,
            trigger: 'blur',
            message: '密码长度6-16位'
          }
        ]
      }
    }
  },
  created() {
    this.getUserDetailById()
  },
  methods: {
    async updateData() {
      try {
        await this.$refs.formRef.validate()
        this.saveUserDetailById()
        this.$message.success('更新信息成功！')
      } catch (e) {
        this.$message.error(e.message || '服务端发生错误')
      }
    },
    async getUserDetailById() {
      const res = await getUserDetailById(this.$route.params.id)
      this.form = res
    },
    async saveUserDetailById() {
      await saveUserDetailById({
        ...this.form,
        password: this.form.password2
      })
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  margin: 20px;
}
</style>
