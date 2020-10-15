<template>
  <div>
    <el-upload
      :action="url"
      :file-list="list"
      list-type="picture-card"
      :before-upload="beforeUpload"
      :on-success="handleSuccess"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :limit="count"
      :class="{ full: full}"
    >
      <i class="el-icon-plus"></i>
      <p slot="tip">请上传大于700 * 700像素，小于3M的图片</p>
    </el-upload>
    <el-dialog :visible.sync="previewVisible" width="60%">
      <img width="100%" :src="previewUrl" alt="preview" />
    </el-dialog>
  </div>
</template>

<script>
const arrEq = (a, b) => {
  const a1 = a || [];
  const b1 = b || [];
  if (a1.length !== b1.length) {
    return false;
  }
  for (let index = 0; index < a1.length; index++) {
    if (a1[index] !== b1[index]) {
      return false;
    }
  }
  return true;
};
export default {
  name: "SingleImageUpload2",
  props: {
    value: {
      type: Array,
      default: [],
    },
    headers: {
      type: Object,
      default: {},
    },
    url: {
      type: String,
      default: "",
    },
    count: {
      type: Number,
      default: 1,
    },
    limit: {
      type: Object,
      default: ()=>({}),
    },
  },
  data() {
    return {
      list: [],
      previewVisible: false,
      previewUrl: "",
      full: false
    };
  },
  watch: {
    value(cur, old) {
      const ls = this.list.map((i) => (i.response ? i.response.data : i.url));
      if (!arrEq(cur, old) && !arrEq(cur, ls)) {
        const list = cur.map((i, j) => ({
          name: j + "." + i.split(".").pop(),
          url: i,
        }));
        console.log("update", list);
        this.list = list;
        this.full = list.length >= this.count
      }
    },
  },
  methods: {
    handleSuccess(resp, img, list) {
      console.log("success", img, list);
      this.list = list || [];
      this.emitInput();
    },
    handlePreview(img, i) {
      console.log("preview", img, i);
      this.previewUrl = img.url;
      this.previewVisible = true;
    },
    handleRemove(img, list) {
      console.log("remove", img, list);
      this.list = list || [];
      this.emitInput();
    },
    emitInput() {
      console.log(
        "change",
        this.list.map((i) => (i.response ? i.response.data : i.url))
      );
      this.$emit(
        "input",
        this.list.map((i) => (i.response ? i.response.data : i.url))
      );
      this.full = this.list.length >= this.count
    },
    beforeUpload(file, i) {
      console.log("upload", file, i);
      const { type, size } = this.limit;
      if (type && type.list.indexOf(file.type) < 0) {
        this.$message.error(type.tip);
        return false;
      }
      if (size && file.size > size.size) {
        this.$message.error(size.tip);
        return false;
      }
      return true;
    },
  },
};
</script>

<style lang="scss">
.full .el-upload {
  display: none;
}
</style>
