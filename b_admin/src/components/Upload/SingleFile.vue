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
        <span v-if="file" style="margin-left: 8px">{{ file }}</span>
      </div>
      <p slot="tip" v-if="tip" class="tip">{{ tip }}</p>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: "SingleFile",
  props: {
    value: {
      type: String,
      default: "",
    },
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
      file: "",
      handle: {},
      show: true,
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
      this.files = file ? [file] : [];
      this.file = file.name;
      this.$emit("input", file.name);
      // console.log("change", this.files);
    },
    handleSuccess(resp) {
      // console.log("success", resp, this.files);
      if (resp.code === 0 || resp.code === 200) {
        this.handle.resolve(resp);
      } else {
        this.handleError(resp);
      }
    },
    handleError(error) {
      setTimeout(() => {
        this.files = [];
        this.file = "";
        this.$emit("input", null);
        this.handle.reject(error);
        this.$forceUpdate();
      }, 0);
    },
    handleRemove() {
      //   console.log("remove");
      this.files = [];
      this.file = "";
    },
  },
};
</script>

<style lang="scss">
.tip {
  margin: 0;
}
</style>
