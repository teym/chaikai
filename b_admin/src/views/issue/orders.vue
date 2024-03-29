<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="请输入商品名称"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <el-button
        class="filter-item"
        style="float: right"
        type="primary"
        icon="el-icon-edit"
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
      <el-table-column label="达人" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请信息" width="110px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请渠道" width="110px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="粉丝/万" width="110px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="合作方式" width="110px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Actions"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)"
            >通过</el-button
          >
          <el-button
            v-if="row.status != 'deleted'"
            size="mini"
            type="danger"
            @click="handleDelete(row, $index)"
            >拒绝</el-button
          >
          <el-button type="primary" size="mini" @click="handleUpdate(row)"
            >候选</el-button
          >
        </template>
      </el-table-column>
      <div slot="empty" class="empty" style="padding: 48px 0">
        <img src="@/assets/images/goods_empty.png" alt="empty" />
        <p style="margin: 0; color: #999">暂无问题</p>
      </div>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { fetchList } from "@/api/article";
import { mapGetters } from "vuex";
import waves from "@/directive/waves"; // waves directive
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
        limit: 20,
        title: undefined,
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
      fetchList(this.listQuery).then((response) => {
        this.list = response.data.items;
        this.total = response.data.total;

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
    createData() {},
    handleUpdate(row) {},
    handleDelete(row, index) {
      this.$notify({
        title: "Success",
        message: "Delete Successfully",
        type: "success",
        duration: 2000,
      });
      this.list.splice(index, 1);
    },
  },
};
</script>
