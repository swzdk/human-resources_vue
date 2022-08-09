<template>
  <div>
    <el-upload
      action="#"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-change="handleChange"
      :http-request="handleUpload"
      :before-upload="beforeUpload"
      :file-list="fileList"
      :limit="1"
      :class="{havePic:isHavePicture}"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
    <el-progress v-if="progressShow" style="width: 180px" :percentage="percent" />
  </div>
</template>
<script>
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKID2yqY2JLJ7iJhroZCnLn35uY3NXXJtIZl',
  SecretKey: 'GPSL5cBbp9Sk2DJl7HIAtQkssfIk5EAt'
})
export default {
  name: 'ImageUpload',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: [],
      percent: 0,
      progressShow: false
    }
  },
  computed: {
    isHavePicture() {
      return this.fileList.length > 0
    }
  },
  methods: {
    beforeUpload(file) {
      // 要开始做文件上传的检查了
      // 文件类型 文件大小
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      //  检查大小
      const maxSize = 5 * 1024 * 1024 // 1M=1024KB 1KB = 1024B
      if (maxSize < file.size) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      return true
    },
    handleUpload(params) {
      if (params.file) {
        this.progressShow = true
        // 执行上传操作
        cos.putObject(
          {
            Bucket: 'swzdk-1313213627', // 存储桶
            Region: 'ap-nanjing', // 地域
            Key: params.file.name, // 文件名
            Body: params.file, // 要上传的文件对象
            StorageClass: 'STANDARD', // 上传的模式类型 直接默认 标准模式即可
            // 上传到腾讯云 =》 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调
            onProgress: (params) => {
              this.percent = params.percent * 100
            }
          },
          (err, data) => {
            if (!err && data.statusCode === 200) {
              this.fileList.forEach((item) => {
                if (item.uid === params.file.uid) {
                  item.url = `http://${data.Location}`
                  item.upload = true
                }
              })
              // 延时把进度条关闭
              setTimeout(() => {
                this.progressShow = false
                this.percent = 0
              }, 2000)
            }
          }
        )
      }
    },
    handleChange(file, fileList) {
      this.fileList = fileList
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  }
}
</script>

<style scoped lang="scss">
.havePic {
  ::v-deep .el-upload--picture-card {
    display: none;
  }
}
</style>
