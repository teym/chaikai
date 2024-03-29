<template>
  <div class="app-container">
    <div class="filter-container">
      <span class="filter-item">商品管理</span>
      <el-input
        v-model="listQuery.key"
        placeholder="请输入商品名称"
        style="margin-left: 12px; width: 200px"
        size="mini"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
      >
        <el-icon slot="prefix" class="el-icon-search el-input__icon" />
      </el-input>

      <el-button
        class="filter-item"
        style="float: right"
        type="primary"
        size="mini"
        @click="handleCreate"
        >创建商品</el-button
      >
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="商品名称">
        <template slot-scope="{ row }">
          <div class="info">
            <img :src="row.picUrl" alt="pic" class="pic" />
            <span>{{ row.title }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="品牌" align="center">
        <template slot-scope="{ row }">
          <span>{{ (row.brand || {}).name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button type="text" size="mini" @click="handleUpdate(row)"
            >编辑</el-button
          >
          <el-button
            v-if="row.status != 'deleted'"
            size="mini"
            type="text"
            @click="handleDelete(row, $index)"
            >删除</el-button
          >
        </template>
      </el-table-column>
      <div slot="empty" class="empty" style="padding: 48px 0;">
        <img src="@/assets/images/goods_empty.png" alt="empty" />
        <p style="margin: 0;color: #999;">暂无商品</p>
      </div>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { fetchList, removeData } from "@/api/goods";
import waves from "@/directive/waves"; // waves directive
import { mapGetters } from "vuex";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "ComplexTable",
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 20,
        key: undefined,
      },
    };
  },
  computed: {
    ...mapGetters(["name", "avatar", "telephone", "statusCode", "brandCount"]),
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(({ data }) => {
        this.list = data.data;
        this.total = data.pager.count;

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleCreate() {
      if (this.statusCode !== 3) {
        this.$alert("无法创建商品，为保障品牌合作规范，请先完成企业认证").then(
          (r) => {
            if (r === "confirm") {
              this.$router.push("/user/create");
            }
          }
        );
      } else if (this.brandCount === 0) {
        this.$alert("无法创建商品，为保障品牌合作规范，请先完成品牌授权").then(
          (r) => {
            if (r === "confirm") {
              this.$router.push("/user/auth");
            }
          }
        );
      } else {
        this.$router.push("/goods/create");
      }
    },
    handleUpdate(row) {
      this.$router.push({ path: "/goods/create", query: { id: row.id } });
    },
    handleDelete(row, index) {
      this.$confirm(
        "确认删除商品" + row.title + ",将无法恢复",
        "删除商品",
        {}
      ).then((r) => {
        if (r === "confirm") {
          removeData(row.id).then((r) => {
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
              duration: 2000,
            });
            this.getList();
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  .filter-container {
    background-color: white;
    padding: 16px 16px 6px 16px;
    border-radius: 4px;
    span {
      font-size: 16px;
      margin-right: 8px;
    }
  }
  .el-table {
    margin: 20px 0;
    border-radius: 4px;
  }
  .info {
    display: flex;
    flex-direction: row;
    align-items: center;
    img {
      width: 90px;
      height: 90px;
      border-radius: 4px;
      margin-right: 8px;
    }
    span {
      font-size: 14px;
      color: #666;
      flex: 1;
    }
  }
}
</style>
