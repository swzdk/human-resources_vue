<template>
  <div class="page-tools">
    <el-card>
      <el-row type="flex">
        <el-col>
          <div class="before" v-if="$slots.before">
            <i class="el-icon-warning-outline"></i>
            <slot name="before"></slot>
          </div>
        </el-col>
        <el-col>
          <el-row type="flex" justify="end" style="padding-top:6px">
            <slot name="after"></slot>
          </el-row>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'PageTool'
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
