<template>
  <div class="upload-container">
    <el-upload
      :data="dataObj"
      :multiple="false"
      :show-file-list="false"
      :on-success="handleImageSuccess"
      :http-request="handleFileUpload"
      class="image-uploader"
      drag
      action="https://httpbin.org/post"
    >
      <img v-if="imageUrl" :src="imageUrl">
      <div v-else class="place">
        <i class="el-icon-upload" />
        <p>上传图片</p>
      </div>
    </el-upload>
  </div>
</template>

<script>
import request from '@/utils/request'

export default {
  name: 'SingleImageUpload3',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tempUrl: '',
      dataObj: { token: '', key: '' }
    }
  },
  computed: {
    imageUrl() {
      return this.value
    }
  },
  methods: {
    rmImage() {
      this.emitInput('')
    },
    emitInput(val) {
      this.$emit('input', val)
    },
    handleImageSuccess(file) {
      this.emitInput(file.files.file)
    },
    beforeUpload() {
      return true
    },
    handleFileUpload(f) {
      this.loading = true
      const form = new FormData()
      form.append('file', f.file)
      request({
        url: '/oss/upload',
        method: 'post',
        data: form,
        headers: { 'Content-Type': 'multipart/form-data' }
        // onUploadProgress: f.onProgress
      })
        .then((r) => {
          console.log(r)
          this.loading = false
          f.onSuccess({ files: { file: r.data }})
        })
        .catch((e) => {
          this.loading = false
          console.log(e)
          f.onError(e)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.upload-container {
  width: 100%;
  position: relative;
  @include clearfix;

  .place {
    p {
      margin: 8px 0;
      color: #999999;
    }
  }
  .image-uploader {
    width: 35%;
    float: left;
  }
  .image-preview {
    width: 200px;
    height: 200px;
    position: relative;
    border: 1px dashed #d9d9d9;
    float: left;
    margin-left: 50px;
    .image-preview-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .image-preview-action {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      cursor: default;
      text-align: center;
      color: #fff;
      opacity: 0;
      font-size: 20px;
      background-color: rgba(0, 0, 0, 0.5);
      transition: opacity 0.3s;
      cursor: pointer;
      text-align: center;
      line-height: 200px;
      .el-icon-delete {
        font-size: 36px;
      }
    }
    &:hover {
      .image-preview-action {
        opacity: 1;
      }
    }
  }
  .image-app-preview {
    width: 320px;
    height: 180px;
    position: relative;
    border: 1px dashed #d9d9d9;
    float: left;
    margin-left: 50px;
    .app-fake-conver {
      height: 44px;
      position: absolute;
      width: 100%; // background: rgba(0, 0, 0, .1);
      text-align: center;
      line-height: 64px;
      color: #fff;
    }
  }
}
</style>
