<template>
  <div class="address-container">
    <!-- <div class="index">
      <span v-for="i in addressKeys" :key="i" class="pill">{{ i }}</span>
    </div> -->
    <div class="groups">
      <el-row v-for="(i, j) in area" :key="j" class="row">
        <el-col :span="4">
          <el-checkbox
            v-if="i.id !== show"
            :checked="checked(value, i)"
            @change="handleCheckAllChange(value, i)"
            >{{ i.name }}</el-checkbox
          >
        </el-col>
        <el-col :span="20">
          <el-row v-if="i.id !== show" :gutter="10">
            <el-col v-for="(m, n) in i.list" :key="n" :span="4">
              <el-checkbox
                :checked="checked(value, i, m)"
                @change="handleCheckAllChange(value, i, m)"
                >{{ m.name }}</el-checkbox
              >
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { area } from "@/utils/area";

export default {
  name: "AAddress",
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    type: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      addressKeys: Array.from(new Set(area.map((i) => i.key))).sort(),
      area: area.sort((a, b) => (a.key > b.key ? 1 : a.key < b.key ? -1 : 0)),
      show: 0,
    };
  },
  methods: {
    handleCheckAllChange(value, p, c) {
      var nv = value;
      if (c) {
        if (value.find((i) => i.provinceId === p.id && !i.cityId)) {
          nv = value
            .filter((i) => i.provinceId !== p.id)
            .concat(
              p.list
                .filter((i) => i.id !== c.id)
                .map((i) => ({
                  provinceId: p.id,
                  province: p.name,
                  cityId: i.id,
                  type: this.type,
                  city: i.name,
                  name: p.name + c.name,
                }))
            );
        } else {
          if (value.find((i) => i.provinceId === p.id && i.cityId === c.id)) {
            nv = value.filter(
              (i) => !(i.provinceId === p.id && i.cityId === c.id)
            );
          } else {
            if (
              value.filter((i) => i.provinceId === p.id).length + 1 ===
              p.list.length
            ) {
              nv = value
                .filter((i) => i.provinceId !== p.id)
                .concat([
                  {
                    provinceId: p.id,
                    type: this.type,
                    province: p.name,
                    name: p.name,
                  },
                ]);
            } else {
              nv = value.concat([
                {
                  provinceId: p.id,
                  province: p.name,
                  cityId: c.id,
                  type: this.type,
                  city: c.name,
                  name: p.name + c.name,
                },
              ]);
            }
          }
        }
      } else {
        if (
          value.filter((i) => i.provinceId === p.id && !i.cityId).length > 0
        ) {
          nv = value.filter((i) => i.provinceId !== p.id);
        } else {
          nv = value
            .filter((i) => i.provinceId !== p.id)
            .concat([
              {
                provinceId: p.id,
                type: this.type,
                province: p.name,
                name: p.name,
              },
            ]);
        }
      }
      this.show = p.id;
      this.$emit("input", nv);
      this.$nextTick().then(() => {
        this.show = null;
      });
    },
    checked(value, p, c) {
      return !!(
        value.find((i) => i.provinceId === p.id && !i.cityId) ||
        (c && value.find((i) => i.provinceId === p.id && i.cityId === c.id))
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.address-container {
  .index {
    margin-bottom: 16px;
    margin-left: -4px;
  }
  .pill {
    min-width: 24px;
    height: 24px;
    border-radius: 12px;
    background-color: #d8d8d8;
    margin: 0 4px;
    padding: 0 4px;
    text-align: center;
    font-size: 14px;
    line-height: 24px;
    display: inline-block;
  }
  .groups {
    height: 320px;
    overflow: hidden scroll;
    .row {
      padding: 8px 0 0 0;
      .el-checkbox {
        margin: 4px 8px 4px 0;
      }
    }
  }
}
</style>
