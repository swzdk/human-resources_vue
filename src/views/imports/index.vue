<template>
  <UploadExcel :on-success="onSuccess" />
</template>

<script>
import { importEmployee } from '@/api/employees'
export default {
  methods: {
    async onSuccess({ header, results }) {
      // 如果是导入员工
      const userRelations = {
        入职日期: 'timeOfEntry',
        手机号: 'mobile',
        姓名: 'username',
        转正日期: 'correctionTime',
        工号: 'workNumber'
      }
      const arr = []
      results.forEach((item) => {
        const userInfo = {}
        Object.keys(item).forEach((key) => {
          if (key.includes('日期')) {
            console.log(item[key])
            userInfo[userRelations[key]] = new Date(this.formatDate(item[key]))
          } else {
            userInfo[userRelations[key]] = item[key]
          }
        })
        arr.push(userInfo)
      })
      console.log(arr)
      await importEmployee(arr) // 调用导入接口
      this.$message.success('添加成功！')
      this.$router.back()
    },
    formatDate(date, fmt = 'yyyy-MM-dd') {
      if (!(date instanceof Array)) {
        date = new Date(date)
      }
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + '').substr(4 - RegExp.$1.length)
        )
      }
      const o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
      }
      for (const k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
          const str = o[k] + ''
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length === 1 ? str : this.padLeftZero(str)
          )
        }
      }
      return fmt
    },
    padLeftZero(str) {
      return ('00' + str).substr(str.length)
    }
  }
}
</script>

<style>
</style>
