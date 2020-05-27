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
        <el-button type="primary" plain @click="addViews" v-show="viewsLastLength == 0">添加图层</el-button>
        <div
          class="view-item"
          v-for="(viewsItem, viewsIndex) in form.templateData.views"
          v-show="viewsIndex != viewsLastLength"
          :key="viewsIndex"
        >
          <div class="item-hd">
                <div>图层{{ viewsIndex + 1 }}</div>
                <div>
                    <el-button type="text">插入图层</el-button>
                    <el-button type="text">折叠</el-button>
                    <el-button type="text">上移一层</el-button>
                    <el-button type="text">下移一层</el-button>
                    <el-button type="text">删除</el-button>
                </div>
          </div>
          <el-form-item label="图层类型：">
            <el-radio-group v-model="viewsItem.viewsMold">
              <el-radio
                v-for="(item, index) in defaultData.viewsMold"
                :key="index"
                :label="item.value"
                >{{ item.name }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <!-- 不变图层 -->
          <div v-if="viewsItem.viewsMold == 1">
            <el-form-item label="选择图片：">
              <div class="store-img-con img-center-com">
                <img :src="viewsItem.url" crossorigin="anonymous" />
                <uploadImg
                  v-on:successFun="addViewImg"
                  :num="viewsIndex"
                ></uploadImg>
              </div>
            </el-form-item>
          </div>
          <div v-else>
            <el-form-item label="图层形式：">
              <el-radio-group
                v-model="viewsItem.type"
                @change="
                  event => {
                    changeViewsType(event, viewsItem, viewsIndex);
                  }
                "
              >
                <el-radio
                  v-for="(item, index) in defaultData.viewsType"
                  :key="index"
                  :label="item.value"
                  >{{ item.name }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
            <el-form-item label="可变字段：">
              <el-select
                v-model="viewsItem.changeKeyWords"
                placeholder="请选择可变字段"
              >
                <el-option
                  v-for="(item, index) in defaultData.changeKeyWords[
                    form.pageType
                  ][viewsItem.viewsType]"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- 可变字段为文字 -->
            <div v-if="viewsItem.type == 'text'">
              <el-form-item label="文字颜色：">
                <el-color-picker
                  v-model="viewsItem.css.color"
                ></el-color-picker>
              </el-form-item>
              <el-form-item label="字号大小：">
                <el-input
                  placeholder="请输入字号大小"
                  v-model="viewsItem.css.fontSize"
                >
                  <template slot="append">px</template>
                </el-input>
              </el-form-item>
              <el-form-item label="行间距：">
                <el-input
                  placeholder="请输入行间距"
                  v-model="viewsItem.css.lineHeight"
                >
                  <template slot="append">px</template>
                </el-input>
              </el-form-item>
              <el-form-item label="对齐形式：">
                <el-radio-group v-model="viewsItem.css.textAlign">
                  <el-radio
                    v-for="(item, index) in defaultData.textAlign"
                    :key="index"
                    :label="item.value"
                    >{{ item.name }}</el-radio
                  >
                </el-radio-group>
              </el-form-item>
            </div>
          </div>
          <!-- 图层公共属性 -->
          <el-form-item label="图层位置：">
            <el-input placeholder="请输入上边距" v-model="viewsItem.css.top">
              {{ viewsItem.css.top }}
              <template slot="prepend">上边距</template>
              <template slot="append">px</template>
            </el-input>
            <el-input placeholder="请输入左边距" v-model="viewsItem.css.left">
              {{ viewsItem.css.left }}
              <template slot="prepend">左边距</template>
              <template slot="append">px</template>
            </el-input>
            <el-input placeholder="请输入下边距" v-model="viewsItem.css.bottom">
              {{ viewsItem.css.bottom }}
              <template slot="prepend">下边距</template>
              <template slot="append">px</template>
            </el-input>
            <el-input placeholder="请输入右边距" v-model="viewsItem.css.right">
              {{ viewsItem.css.right }}
              <template slot="prepend">右边距</template>
              <template slot="append">px</template>
            </el-input>
          </el-form-item>
          <el-form-item label="图层大小：">
            <el-input placeholder="请输入宽度" v-model="viewsItem.css.width">
              <template slot="append">px</template>
            </el-input>
            <el-input placeholder="请输入高度" v-model="viewsItem.css.height">
              <template slot="append">px</template>
            </el-input>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="码设置：">
        <el-form-item label="形状：">
          <el-radio-group
            v-model="form.templateData.views[viewsLastLength].css.borderRadius"
          >
            <el-radio
              v-for="(item, index) in defaultData.borderRadius"
              :key="index"
              :label="item.value"
              >{{ item.name }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="位置：">
          <el-input
            placeholder="请输入上边距"
            v-model="form.templateData.views[viewsLastLength].css.top"
          >
            {{ form.templateData.views[viewsLastLength].css.top }}
            <template slot="prepend">上边距</template>
            <template slot="append">px</template>
          </el-input>
          <el-input
            placeholder="请输入左边距"
            v-model="form.templateData.views[viewsLastLength].css.left"
          >
            {{ form.templateData.views[viewsLastLength].css.left }}
            <template slot="prepend">左边距</template>
            <template slot="append">px</template>
          </el-input>
          <el-input
            placeholder="请输入下边距"
            v-model="form.templateData.views[viewsLastLength].css.bottom"
          >
            {{ form.templateData.views[viewsLastLength].css.bottom }}
            <template slot="prepend">下边距</template>
            <template slot="append">px</template>
          </el-input>
          <el-input
            placeholder="请输入右边距"
            v-model="form.templateData.views[viewsLastLength].css.right"
          >
            {{ form.templateData.views[viewsLastLength].css.right }}
            <template slot="prepend">右边距</template>
            <template slot="append">px</template>
          </el-input>
        </el-form-item>
        <el-form-item label="大小：">
          <el-input
            placeholder="请输入宽度"
            v-model="form.templateData.views[viewsLastLength].css.width"
          >
            <template slot="append">px</template>
          </el-input>
          <el-input
            placeholder="请输入高度"
            v-model="form.templateData.views[viewsLastLength].css.height"
          >
            <template slot="append">px</template>
          </el-input>
        </el-form-item>
        <el-form-item label="线框：">
          <el-radio-group
            v-model="form.templateData.views[viewsLastLength].css.hasBorder"
            @change="changeBorder"
          >
            <el-radio
              v-for="(item, index) in defaultData.hasBorder"
              :key="index"
              :label="item.value"
              >{{ item.name }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <!-- 有现框 -->
        <div v-if="form.templateData.views[viewsLastLength].css.borderWidth">
          <el-form-item label="线框颜色：">
            <el-color-picker
              v-model="form.templateData.views[viewsLastLength].css.borderColor"
            ></el-color-picker>
          </el-form-item>
          <el-form-item label="线框大小：">
            <el-input
              placeholder="请输入线框大小"
              v-model="form.templateData.views[viewsLastLength].css.borderWidth"
            >
              <template slot="append">px</template>
            </el-input>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="预览图片">
        <div class="store-img-con img-center-com">
          <img :src="form.smallBg" crossorigin="anonymous" />
          <uploadImg v-on:successFun="changeSmallBg"></uploadImg>
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
        pageType: 1,
        lable: "",
        activityType: "",
        smallBg: "",
        templateData: {
          width: "500",
          height: "875",
          background: "",
          views: [
            // {
            //   viewsMold: 1,
            //   viewsType: "text",
            //   type: "image",
            //   changeKeyWords: "",
            //   url:
            //     "https://api.cw100.com//storage/mini_wxcbe60162f9dc451c/2020/04/21/_a=3361&t=kq&sid=87&cid=110100.jpg",
            //   css: {
            //     right: "28",
            //     bottom: "122",
            //     width: "161",
            //     height: "161",
            //     borderRadius: "80",
            //     borderColor: "#333",
            //     borderWidth: "2",
            //     color: "#333",
            //     fontSize: 12,
            //     lineHeight: 12,
            //     textAlign: "center"
            //   }
            // },
            {
              viewsMold: 1,
              viewsType: "text",
              type: "image",
              changeKeyWords: "",
              url:
                "https://api.cw100.com//storage/mini_wxcbe60162f9dc451c/2020/04/21/_a=3361&t=kq&sid=87&cid=110100.jpg",
              css: {
                hasBorder:0,
                right: "28",
                bottom: "122",
                width: "161",
                height: "161",
                borderRadius: "0",
                color: "#333",
                fontSize: 12,
                lineHeight: 12,
                textAlign: "center"
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
        viewsMold: [
          { name: "不变图层", value: 1 },
          { name: "可变图层", value: 2 }
        ],
        viewsType: [
          { name: "文字", value: "text" },
          { name: "图片", value: "image" }
        ],
        changeKeyWords: {
          "1": {
            text: [
              {
                name: "商品标题",
                value:
                  "商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题"
              },
              { name: "商品价格", value: "200000.00" }
            ],
            image: [
              {
                name: "商品图片",
                value:
                  "商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题"
              },
              {
                name: "品牌logo",
                value:
                  "商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题"
              },
              {
                name: "门店logo",
                value:
                  "商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题"
              }
            ]
          },
          "3": {
            text: [
              {
                name: "门店名称",
                value: "门店名称门店名称门店名称门店名"
              },
              {
                name: "门店地址",
                value: "门店地址门店地址门店地址门店地址门店地址"
              },
              {
                name: "店员电话",
                value: "13888888888"
              },
              {
                name: "店员姓名",
                value: "店员姓名店员姓名店员姓名"
              }
            ],
            image: []
          },
          "4": {
            text: [
              {
                name: "文章标题",
                value: "文章标题文章标题文章标题文章标题文章标题"
              }
            ],
            image: []
          }
        },
        textAlign: [
          { name: "居左", value: "left" },
          { name: "居中", value: "center" },
          { name: "居右", value: "right" }
        ],
        borderRadius: [
          { name: "正方形", value: '0' },
          { name: "圆形", value: '1' }
        ],
        hasBorder: [
          { name: "无", value: 0},
          { name: "有", value: 1 }
        ],
        blankViews:{
              viewsMold: 1,
              type: "image",
              url:"",
              css: {
                right: "",
                bottom: "",
                width: "",
                height: ""
              }
            }
      },
      customStyle: "",
      baseUrl: "/baseImg"
    };
  },
  computed: {
    viewsLastLength() {
      return this.form.templateData.views.length - 1;
    }
    // templateData() {
    //   return {
    //     background: this.baseUrl + this.form.bgImg,
    //     width: "500",
    //     height: "875",
    //     views: [
    //       {
    //         type: "image",
    //         url:
    //           "https://api.cw100.com//storage/mini_wxcbe60162f9dc451c/2020/04/21/_a=3361&t=kq&sid=87&cid=110100.jpg",
    //         css: {
    //           right: "28",
    //           bottom: "122",
    //           width: "161",
    //           height: "161",
    //           borderRadius: "80",
    //           borderColor: "#333",
    //           borderWidth: "2"
    //         }
    //       },
    //       {
    //         type: "text",
    //         text: "名称",
    //         css: {
    //           top: "11",
    //           width: "201",
    //           color: "#00BE9B",
    //           left: "250",
    //           align: "center",
    //           textAlign: "center",
    //           fontSize: "23",
    //           lineHeight: "25"
    //         }
    //       },
    //       {
    //         type: "text",
    //         text: "2018.1.1~2019.2.3",
    //         css: {
    //           left: "250",
    //           align: "center",
    //           textAlign: "center",
    //           top: "444",
    //           color: "#231815",
    //           fontSize: "33",
    //           lineHeight: "29",
    //           fontWeight: "bold"
    //         }
    //       }
    //     ]
    //   };
    // }
  },
  methods: {
    onImgOk() {
      console.log(111111111);
    },
    changeSmallBg(data){
      this.form.smallBg = this.baseUrl + data.file.path;
    },
    changeBgImg(data) {
      this.form.templateData.background = this.baseUrl + data.file.path;
    },
    handleChange(val) {
      console.log(val);
    },
    addViewImg(data) {
      let { file, num } = data;
      let copyItem = this.form.templateData.views[num];
      copyItem.url = this.baseUrl + file.path;
      this.form.templateData.views.splice(num, 1, copyItem);
    },
    changeViewsType(e, item, index) {
      item.changeKeyWords = "";
    },
    changeBorder(e){
      let a = JSON.parse(JSON.stringify(this.form.templateData.views[this.viewsLastLength].css)) 
      if(e == 0){
        delete a.borderWidth
        delete a.borderColor
        // this.$delete(this.form.templateData.views[this.viewsLastLength].css,'borderWidth')
        // this.$delete(this.form.templateData.views[this.viewsLastLength].css,'borderColor')
      }else{
        a.borderWidth = '1'
        a.borderColor = '#333'
        // this.$set(this.form.templateData.views[this.viewsLastLength].css,'borderWidth','1')
        // this.$set(this.form.templateData.views[this.viewsLastLength].css,'borderColor','#333')
      }
      this.$nextTick()
      .then(() => {
        this.form.templateData.views[this.viewsLastLength].css = a
      })
    },
    addViews(index=0){
      this.form.templateData.views.unshift(this.defaultData.blankViews)
    }
  },
  filters: {
    clear(value) {
      if (!value) {
        return "";
      }
      let val = value.replace("", "");
      console.log(value, val);
      return val;
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
