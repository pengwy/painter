<template>
  <div class="home">
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="适用产品:">
        <el-checkbox-group v-model="form.product">
          <el-checkbox
            v-for="(item, index) in defaultData.product"
            :label="item.value"
            :key="index"
            name="product"
            >{{ item.name }}</el-checkbox
          >
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="海报类型：">
        <el-radio-group v-model="form.pageType">
          <el-radio
            v-for="(item, index) in defaultData.pageType"
            :key="index"
            :label="item.value"
            >{{ item.name }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item label="海报标签：">
        <el-input v-model="form.lable"></el-input>
      </el-form-item>
      <el-form-item label="活动类型：">
        <el-select v-model="form.activityType" placeholder="请选择活动类型">
          <el-option
            v-for="(item, index) in defaultData.activityType"
            :key="index"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="背景图片：">
        <div class="store-img-con img-center-com">
          <img :src="form.templateData.background" crossorigin="anonymous" />
          <uploadImg v-on:successFun="changeBgImg"></uploadImg>
        </div>
      </el-form-item>
      <el-form-item label="基本图层：">
        <div
          class="view-item"
          v-for="(item, index) in form.templateData.views"
          :key="index"
        >
          <div class="item-hd">图层{{ index + 1 }}</div>
          <el-form-item label="图层类型：">
            <el-radio-group v-model="item.viewsType">
              <el-radio
                v-for="(item, index) in defaultData.viewsType"
                :key="index"
                :label="item.value"
                >{{ item.name }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <!-- 不变图层 -->
          <div v-if="(item.viewsType = 1)"></div>
          <div v-else></div>
          <el-form-item label="图层位置：">
            <div>

            </div>
            <el-input placeholder="请输入上边距" v-model="item.css.top">
              {{item.css.top | clearRpx}}
              <template slot="prepend">上边距</template>
              <template slot="append">px</template>
            </el-input>
            <el-input placeholder="请输入左边距" v-model="item.css.left">
              {{item.css.left | clearRpx}}
              <template slot="prepend">左边距</template>
              <template slot="append">px</template>
            </el-input>
            <el-input placeholder="请输入下边距" v-model="item.css.bottom">
               {{item.css.bottom | clearRpx}}
              <template slot="prepend">下边距</template>
              <template slot="append">px</template>
            </el-input>
            <el-input placeholder="请输入右边距" v-model="item.css.right">
              {{item.css.right | clearRpx}}
              <template slot="prepend">右边距</template>
              <template slot="append">px</template>
            </el-input>
          </el-form-item>
          <el-form-item label="图层大小：">
            <el-input placeholder="请输入宽度" v-model="item.css.width">
              <template slot="append">px</template>
            </el-input>
            <el-input placeholder="请输入高度" v-model="item.css.height">
              <template slot="append">px</template>
            </el-input>
          </el-form-item>
        </div>
      </el-form-item>
    </el-form>
    <painter
      class="fl-row-center"
      :customStyle="customStyle"
      @imgOK="onImgOk"
      :paletteDate="form.templateData"
      :dirty="false"
    />
  </div>
</template>
<script>
// @ is an alias to /src
import painter from "@/components/painter/painter.vue";
import uploadImg from "../components/uploadImg.vue";
import { log } from "util";
export default {
  name: "Home",
  mounted() {},
  components: { painter, uploadImg },
  data() {
    return {
      form: {
        product: [1],
        pageType: 0,
        lable: "",
        activityType: "",
        templateData: {
          width: "500rpx",
          height: "875rpx",
          background: "",
          views: [
            {
              viewsType: 1,
              type: "image",
              url:
                "https://api.cw100.com//storage/mini_wxcbe60162f9dc451c/2020/04/21/_a=3361&t=kq&sid=87&cid=110100.jpg",
              css: {
                right: "28rpx",
                bottom: "122rpx",
                width: "161rpx",
                height: "161rpx",
                borderRadius: "80rpx",
                borderColor: "#333",
                borderWidth: "2rpx"
              }
            }
          ]
        }
      },
      defaultData: {
        product: [{ name: "店员助手小程序", value: 1 }],
        pageType: [
          { name: "商品", value: 1 },
          { name: "营销活动", value: 2 },
          { name: "门店", value: 3 },
          { name: "行业内幕", value: 4 },
          { name: "蜜蜂特使", value: 5 },
          { name: "成单黑客", value: 6 }
        ],
        activityType: [
          { name: "签到有礼", value: 1 },
          { name: "拼团售卡", value: 2 },
          { name: "以旧换新", value: 3 }
        ],
        viewsType: [
          { name: "不变图层", value: 1 },
          { name: "可变图层", value: 2 }
        ]
      },
      customStyle: "",
      baseUrl: "/baseImg"
    };
  },
  computed: {
    templateData() {
      return {
        background: this.baseUrl + this.form.bgImg,
        width: "500rpx",
        height: "875rpx",
        views: [
          {
            type: "image",
            url:
              "https://api.cw100.com//storage/mini_wxcbe60162f9dc451c/2020/04/21/_a=3361&t=kq&sid=87&cid=110100.jpg",
            css: {
              right: "28rpx",
              bottom: "122rpx",
              width: "161rpx",
              height: "161rpx",
              borderRadius: "80rpx",
              borderColor: "#333",
              borderWidth: "2rpx"
            }
          },
          {
            type: "text",
            text: "名称",
            css: {
              top: "11rpx",
              width: "201rpx",
              color: "#00BE9B",
              left: "250rpx",
              align: "center",
              textAlign: "center",
              fontSize: "23rpx",
              lineHeight: "25rpx"
            }
          },
          {
            type: "text",
            text: "2018.1.1~2019.2.3",
            css: {
              left: "250rpx",
              align: "center",
              textAlign: "center",
              top: "444rpx",
              color: "#231815",
              fontSize: "33rpx",
              lineHeight: "29rpx",
              fontWeight: "bold"
            }
          }
        ]
      };
    }
  },
  methods: {
    onImgOk() {
      console.log(1);
    },
    changeBgImg(file) {
      this.form.templateData.background = this.baseUrl + file.path;
    },
    handleChange(val) {
      console.log(val);
    }
  },
  filters: {
    clearRpx(value){
      if(!value){
        return ''
      }
      let val = value.replace('rpx','')
      console.log(value,val);
      return val
    }
    // addImgBaseUrl: function(value) {
    //   return `/baseImg${value}`;
    // }
  }
};
</script>
<style lang="scss">
.store-img-con {
  position: relative;
  display: flex;
  width: 120px;
  height: 120px;
  margin-left: 20px;
  border: 1px solid #ececec;

  img {
    width: initial;
    height: initial;
    max-width: 120px;
    max-height: 120px;
  }
  .icon-qiehuan {
    display: none;
    position: absolute;
    right: 0;
    bottom: 0;
    padding: 2px;
    background-color: rgba(0, 0, 0, 0.4);
  }
  .icon-lianjie {
    display: none;
    position: absolute;
    right: 21px;
    bottom: 0;
    padding: 2px;
    background-color: rgba(0, 0, 0, 0.4);
  }
}
.store-img-con:hover {
  border: 1px solid #4393e5;
  i {
    display: block;
  }
}
</style>
