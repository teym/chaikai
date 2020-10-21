<template>
  <div>
    <el-upload
      ref="upload"
      :action="url"
      :headers="headers"
      :show-file-list="false"
      :file-list="files"
      :on-change="handleChange"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-remove="handleRemove"
      :auto-upload="false"
    >
      <div>
        <el-button size="small" type="primary">点击上传</el-button>
        <span style="margin-left: 8px">{{
          (this.files[0] || {}).name || ""
        }}</span>
      </div>
      <p slot="tip" v-if="tip" class="tip">{{ tip }}</p>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: "SingleFile",
  props: {
    headers: {
      type: Object,
      default: {},
    },
    url: {
      type: String,
      default: "",
    },
    tip: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      files: [],
      handle: {},
    };
  },
  methods: {
    submit() {
      return new Promise((resolve, reject) => {
        this.handle = { resolve, reject };
        this.$refs.upload.submit();
      });
    },
    handleChange(file, fileList) {
    //   console.log("change", file);
      this.files = file ? [file] : [];
    },
    handleSuccess(resp) {
      console.log("success", resp);
      this.handle.resolve(resp);
    },
    handleError(error) {
      console.log("error", error);
      this.handle.reject(error);
    },
    handleRemove() {
    //   console.log("remove");
      this.files = [];
    },
  },
};
</script>

<style lang="scss">
.tip {
  margin: 0;
}
</style>
