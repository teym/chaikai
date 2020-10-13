<template>
  <div class="dashboard-container">
    <div class="filter-container">
      <el-button
        size="mini"
        :loading="sync"
        @click="onSync"
      >企业通讯录同步</el-button>
      <el-button size="mini" @click="onAdd">新增角色</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="角色名称">
        <template slot-scope="{ row }">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button size="mini" @click="onPro(row)">权限配置</el-button>
          <el-button size="mini" @click="onRol(row)">人员配置 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog width="60%" title="角色配置" :visible.sync="proVisible">
      <div class="detail">
        <div class="row">
          <h3>角色名称</h3>
          <div>
            <el-input
              v-model="detail.remark"
              size="mini"
              maxlength="10"
              show-word-limit
            />
          </div>
        </div>
        <el-checkbox-group v-model="detail.menuIdList">
          <div v-for="(pro, i) in proList" :key="i" class="row">
            <h4>{{ pro.name }}</h4>
            <div>
              <el-checkbox v-for="(p, j) in pro.list" :key="j" :label="p.id">{{
                p.name
              }}</el-checkbox>
            </div>
          </div>
        </el-checkbox-group>
      </div>
      <div slot="footer">
        <el-button
          v-if="detail.roleId"
          :loading="detailLoading"
          @click="onProRemove"
        >删除</el-button>
        <el-button @click="proVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="detailLoading"
          @click="onProSave"
        >确定</el-button>
      </div>
    </el-dialog>
    <el-dialog width="60%" title="人员" :visible.sync="rolVisible">
      <div class="detail">
        <div class="row">
          <h3>角色名称</h3>
          <p style="margin: 0; line-height: 28px">{{ detail.remark }}</p>
        </div>
        <el-tree
          ref="tree"
          :data="detail.users"
          :default-checked-keys="detail.checked"
          show-checkbox
          node-key="id"
        />
      </div>
      <div slot="footer">
        <el-button @click="rolVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="detailLoading"
          @click="onRolSave"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  getAllRoutes,
  getRoles,
  addRole,
  updateRole,
  deleteRole,
  getUsers,
  syncUser,
  updateRoleUser
} from '@/api/role'
import _ from 'underscore'

export default {
  name: 'Dashboard',
  data() {
    return {
      list: [],
      listLoading: false,
      detail: {},
      detailLoading: false,
      proVisible: false,
      rolVisible: false,
      sync: false,
      proList: [
        {
          name: '认证管理',
          list: [
            { name: '企业认证', id: 1 },
            { name: '品牌授权', id: 2 },
            { name: '达人认证', id: 3 }
          ]
        },
        {
          name: '账号管理',
          list: [
            { name: '达人列表', id: 4 },
            { name: '企业列表', id: 5 }
          ]
        },
        { name: '活动管理', list: [{ name: '活动列表', id: 6 }] },
        {
          name: '业务管理',
          list: [
            { name: '订单管理', id: 7 },
            { name: '投诉测评', id: 8 }
          ]
        },
        {
          name: '财务管理',
          list: [
            { name: '开票申请', id: 9 },
            { name: '品牌方提现', id: 10 },
            { name: '品牌方充值', id: 11 },
            { name: '达人提现', id: 12 },
            { name: '打款赠送', id: 13 }
          ]
        },
        {
          name: '工具配置',
          list: [
            { name: '轮播图', id: 14 },
            { name: '活动图', id: 15 }
          ]
        },
        { name: '权限管理', list: [{ name: '角色配置', id: 16 }] },
        { name: '代理账号', list: [{ name: '代理登陆', id: 17 }] }
      ]
    }
  },
  computed: {
    ...mapGetters(['roles'])
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.listLoading = true
      getRoles()
        .then((r) => {
          this.list = r.data
          this.listLoading = false
        })
        .catch((e) => {
          this.listLoading = false
        })
    },
    loadUser(roleId) {
      getUsers({ roleId }).then((r) => {
        this.detail.users = r.data.map((i) => ({
          id: i.id,
          label: i.name,
          children: i.users.map((j) => ({ id: j.userId, label: j.name }))
        }))
        this.detail.checked = _.flatten(r.data.map((i) => i.users))
          .filter((i) => i.hasRole)
          .map((i) => i.userId)
      })
    },
    loadRouters(roleId) {
      getAllRoutes({ roleId }).then((r) => {
        this.proList = r.data.map((i) => ({
          name: i.name,
          list: i.list.map((j) => ({ name: j.name, id: j.menuId }))
        }))
        this.detail.menuIdList = _.flatten(r.data.map((i) => i.list))
          .filter((i) => i.open)
          .map((i) => i.menuId)
      })
    },
    onSync() {
      this.sync = true
      syncUser()
        .then((r) => {
          this.sync = false
          this.$message({ message: '同步成功', type: 'success' })
        })
        .catch((e) => {
          this.sync = false
        })
    },
    onAdd() {
      this.detail = { menuIdList: [], remark: '', roleName: 'Customer' }
      this.proVisible = true
    },
    onPro(row) {
      if (!row.menuIdList) {
        row.menuIdList = []
      }
      this.detail = row
      this.proList = []
      this.proVisible = true
      this.loadRouters(row.roleId)
    },
    onProRemove() {
      this.$confirm('确定删除?').then((r) => {
        this.detailLoading = true
        deleteRole(this.detail.roleId)
          .then((r) => {
            this.detailLoading = false
            this.proVisible = false
            this.loadData()
          })
          .catch((e) => {
            this.detailLoading = false
          })
      })
    },
    onProSave() {
      const obj = Object.assign({}, this.detail)
      obj.remark = obj.remark.trim()
      if (obj.menuIdList.length <= 0) {
        this.$message({ message: '请选择权限', type: 'error' })
        return
      }
      if (obj.remark.length <= 0) {
        this.$message({ message: '请输入角色名称', type: 'error' })
        return
      }
      if (obj.remark.length > 10) {
        this.$message({ message: '角色名称最多10个字符', type: 'error' })
        return
      }
      this.detailLoading = true;
      (this.detail.roleId ? updateRole : addRole)(this.detail)
        .then((r) => {
          this.$message({ message: '修改成功', type: 'success' })
          this.detailLoading = false
          this.proVisible = false
          this.loadData()
        })
        .catch((e) => {
          this.detailLoading = false
        })
    },
    onRol(row) {
      this.detail = Object.assign({ users: [], checked: [] }, row)
      this.rolVisible = true
      this.loadUser(row.roleId)
    },
    onRolSave() {
      const ids = this.$refs.tree.getCheckedNodes()
      if (ids.length <= 0) {
        this.$message({ message: '请选择人员', type: 'error' })
        return
      }
      this.detailLoading = true
      updateRoleUser({
        roleId: this.detail.roleId,
        userIds: ids.map((i) => i.id)
      })
        .then((r) => {
          this.$message({ message: '修改成功', type: 'success' })
          this.detailLoading = false
          this.rolVisible = false
        })
        .catch((e) => {
          this.detailLoading = true
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 20px;
  .tools {
    margin: 20px 0;
    .block {
      background-color: white;
      border-radius: 4px;
      padding: 20px;
      height: 185px;
      h3 {
        margin: 0 0 12px 0;
        padding: 0;
      }
      .el-col {
        padding: 8px;
      }
    }
    .function {
      .el-col div {
        display: flex;
        flex-direction: row;
        align-items: center;
        font-size: 16px;
        img {
          width: 40px;
          height: 40px;
          margin-right: 8px;
        }
      }
    }
    .task {
      .el-col {
        font-size: 16px;
        color: #333;
        span {
          font-size: 26px;
          line-height: 40px;
          color: #2873fc;
        }
      }
      .title {
        font-size: 22px;
        font-weight: bold;
      }
    }
  }
}
.detail {
  .row {
    display: flex;
    flex-direction: row;
    margin-top: 12px;
    h3 {
      width: 80px;
      line-height: 28px;
      margin: 0;
      padding: 0;
    }
    h4 {
      width: 80px;
      margin: 0;
      padding: 0;
      font-size: 14px;
    }
    > div {
      flex: 1;
    }
  }
}
</style>
