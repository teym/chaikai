<template>
  <div>
    <el-upload
      :disabled="disabled"
      :action="url"
      :headers="headers"
      :show-file-list="false"
      :on-change="handleChange"
      :before-upload="beforeUpload"
      :on-success="handleSuccess"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
    >
      <ul v-if="fileurl" class="el-upload-list el-upload-list--picture-card">
        <li tabindex="0" class="el-upload-list__item is-success">
          <img :src="fileurl" alt="" class="el-upload-list__item-thumbnail" />
          <label class="el-upload-list__item-status-label"
            ><i class="el-icon-upload-success el-icon-check"></i></label
          ><span class="el-upload-list__item-actions"
            ><span
              class="el-upload-list__item-preview"
              @click.stop="handlePreview"
              ><i class="el-icon-zoom-in"></i></span
            ><span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click.stop="handleRemove"
              ><i class="el-icon-delete"></i></span
          ></span>
        </li>
      </ul>
      <div v-else tabindex="0" class="el-upload el-upload--picture-card">
        <i class="el-icon-plus"></i>
      </div>
    </el-upload>
    <p class="tip">{{tip}}</p>
    <el-dialog :visible.sync="previewVisible" width="60%">
      <img width="100%" :src="previewUrl" alt="preview" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "SingleImageUpload3",
  props: {
    value: {
      type: String,
      default: "",
    },
    headers: {
      type: Object,
      default: () => ({}),
    },
    url: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    tip: {
      type: String,
      default: "",
    },
    limit: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      previewVisible: false,
      previewUrl: "",
      fileurl: this.value,
    };
  },
  watch: {
    value(cur, old) {
      this.fileurl = cur;
    },
  },
  methods: {
    handleChange(img, list) {
      console.log("change", img, list);
      this.fileurl = img.url;
    },
    handleSuccess(resp, img, list) {
      this.fileurl = resp.data;
      this.emitInput();
    },
    handlePreview() {
      this.previewUrl = this.fileurl;
      this.previewVisible = true;
    },
    handleRemove() {
      console.log("remove");
      this.fileurl = "";
      this.emitInput();
    },
    emitInput() {
      const url = this.fileurl;
      this.$emit("input", url);
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

<style lang="css">
.tip {
  margin: 0;
  color: #999;
}
</style>