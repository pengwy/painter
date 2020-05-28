<template>
  <div class="home">
    <el-form ref="form" :model="form" label-width="100px">
      <el-row>
        <el-col :span="13">
          <el-form-item label="适用产品：">
            <el-checkbox-group v-model="form.product">
              <el-checkbox
                v-for="(item, index) in defaultData.product"
                :label="item.value"
                :key="index"
                name="product"
              >{{ item.name }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="13">
          <el-form-item label="海报类型：">
            <el-radio-group v-model="form.pageType">
              <el-radio
                v-for="(item, index) in defaultData.pageType"
                :key="index"
                :label="item.value"
                @change="initTemplate"
              >{{ item.name }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="13">
          <el-col :span="16">
            <el-form-item label="海报标签：">
              <el-input v-model="form.lable"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item v-if="form.pageType == 2" label="活动类型：">
              <el-select v-model="form.activityType" placeholder="请选择活动类型">
                <el-option
                  v-for="(item, index) in defaultData.activityType"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :span="13">
          <el-col :span="16">
            <el-form-item label="背景图片：">
              <div class="upload-com">
                <img :src="form.templateData.background" crossorigin="anonymous" class="upload-img" />
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
                    <el-button type="text" @click="addViews(viewsIndex)">插入图层</el-button>
                    <el-button type="text">折叠</el-button>
                    <el-button type="text" v-show="viewsIndex > 0" @click="upViews(viewsIndex)">上移一层</el-button>
                    <el-button
                      type="text"
                      v-show="viewsIndex < viewsLastLength - 1"
                      @click="downViews(viewsIndex)"
                    >下移一层</el-button>
                    <el-button type="text" @click="deleteViews(viewsIndex)">删除</el-button>
                  </div>
                </div>
                <div class="item-bd">
                  <el-form-item label="图层类型：">
                    <el-radio-group v-model="viewsItem.viewsMold">
                      <el-radio
                        v-for="(item, index) in defaultData.viewsMold"
                        :key="index"
                        :label="item.value"
                      >{{ item.name }}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <!-- 不变图层 -->
                  <div v-if="viewsItem.viewsMold == 1">
                    <el-form-item label="选择图片：">
                      <div class="upload-com G-Mb-10">
                        <img :src="viewsItem.url" class="upload-img" crossorigin="anonymous" />
                        <uploadImg v-on:successFun="addViewImg" :num="viewsIndex"></uploadImg>
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
                        >{{ item.name }}</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item label="可变字段：" class="G-Mb-10">
                      <el-select
                        v-model="viewsItem.changeKeyWords"
                        placeholder="请选择可变字段"
                        @change="
                          event => {
                            setKeyWords(event, viewsItem, viewsItem.type);
                          }
                        "
                      >
                        <el-option
                          v-for="(item, index) in defaultData.changeKeyWords[
                            usePageType
                          ][viewsItem.type]"
                          :key="index"
                          :label="item.name"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <!-- 可变字段为文字 -->
                    <div v-if="viewsItem.type == 'text'">
                      <el-form-item label="文字颜色：">
                        <el-color-picker v-model="viewsItem.css.color"></el-color-picker>
                      </el-form-item>
                      <el-form-item label="字号大小：">
                        <el-input placeholder="请输入字号大小" v-model="viewsItem.css.fontSize">
                          <template slot="append">px</template>
                        </el-input>
                      </el-form-item>
                      <el-form-item label="行间距：">
                        <el-input placeholder="请输入行间距" v-model="viewsItem.css.lineHeight">
                          <template slot="append">px</template>
                        </el-input>
                      </el-form-item>
                      <el-form-item label="对齐形式：">
                        <el-radio-group v-model="viewsItem.css.textAlign">
                          <el-radio
                            v-for="(item, index) in defaultData.textAlign"
                            :key="index"
                            :label="item.value"
                          >{{ item.name }}</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </div>
                  </div>
                  <!-- 图层公共属性 -->
                  <el-form-item label="图层位置：" class="change-width">
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
                  <el-form-item label="图层大小：" class="change-width">
                    <el-input placeholder="请输入宽度" v-model="viewsItem.css.width">
                      <template slot="append">px</template>
                    </el-input>
                    <el-input placeholder="请输入高度" v-model="viewsItem.css.height">
                      <template slot="append">px</template>
                    </el-input>
                  </el-form-item>
                </div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-show="form.templateData.background">
            <painter
              class="fl-row-center"
              :customStyle="customStyle"
              @imgOK="onImgOk"
              :paletteDate="form.templateData"
              :dirty="false"
            />
          </el-col>
        </el-col>
        <el-col :span="13">
          <el-col :span="16">
            <el-form-item label="码设置：">
              <el-form-item label="形状：" label-width="60px">
                <el-radio-group v-model="form.templateData.views[viewsLastLength].css.borderRadius">
                  <el-radio
                    v-for="(item, index) in defaultData.borderRadius"
                    :key="index"
                    :label="item.value"
                  >{{ item.name }}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="位置：" label-width="60px" class="change-width">
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
                  <template
                    slot="prepend"
                  >左边距</template>
                  <template slot="append">px</template>
                </el-input>
                <el-input
                  placeholder="请输入下边距"
                  v-model="form.templateData.views[viewsLastLength].css.bottom"
                >
                  {{ form.templateData.views[viewsLastLength].css.bottom }}
                  <template
                    slot="prepend"
                  >下边距</template>
                  <template slot="append">px</template>
                </el-input>
                <el-input
                  placeholder="请输入右边距"
                  v-model="form.templateData.views[viewsLastLength].css.right"
                >
                  {{ form.templateData.views[viewsLastLength].css.right }}
                  <template
                    slot="prepend"
                  >右边距</template>
                  <template slot="append">px</template>
                </el-input>
              </el-form-item>
              <el-form-item label="大小：" class="change-width" label-width="60px">
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
              <el-col :span="8">
                <el-form-item label="线框：" label-width="60px">
                  <el-radio-group
                    v-model="form.templateData.views[viewsLastLength].css.hasBorder"
                    @change="changeBorder"
                  >
                    <el-radio
                      v-for="(item, index) in defaultData.hasBorder"
                      :key="index"
                      :label="item.value"
                    >{{ item.name }}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <!-- 有现框 -->
              <div v-if="form.templateData.views[viewsLastLength].css.borderWidth">
                <el-col :span="7">
                  <el-form-item label="线框颜色：" label-width="100px">
                    <el-color-picker
                      v-model="form.templateData.views[viewsLastLength].css.borderColor"
                    ></el-color-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item label="线框大小：">
                    <el-input
                      placeholder="请输入线框大小"
                      v-model="form.templateData.views[viewsLastLength].css.borderWidth"
                    >
                      <template slot="append">px</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </div>
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :span="13"></el-col>
      </el-row>
      <el-form-item label="预览图片">
        <div class="upload-com">
          <img :src="form.smallBg" crossorigin="anonymous" class="upload-img" />
          <uploadImg v-on:successFun="changeSmallBg"></uploadImg>
        </div>
      </el-form-item>
    </el-form>
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
            {
              viewsMold: 1,
              viewsType: "text",
              type: "image",
              changeKeyWords: "",
              url:
                "https://api.cw100.com//storage/mini_wxcbe60162f9dc451c/2020/04/21/_a=3361&t=kq&sid=87&cid=110100.jpg",
              css: {
                hasBorder: 0,
                right: "28",
                bottom: "122",
                width: "161",
                height: "161",
                borderRadius: "0"
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
          { name: "签到有礼", value: 100 },
          { name: "拼团售卡", value: 200 },
          { name: "以旧换新", value: 300 }
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
                value: "门店名称门店名称门店名称门店名",
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
          },
          "100": {
            text: [
              {
                name: "活动名称",
                value: "活动名称活动名称活动",
              },
              {
                name: "活动时间",
                value: "2020-04-07 至 2020-05-31",
              },
              {
                name: "门店名称",
                value: "门店名称门店名称门店名称门店名",
              }
            ],
            image: []
          },
          "200": {
            text: [
              {
                name: "活动名称",
                value: "活动名称活动名称活动",
              },
              {
                name: "活动时间",
                value: "2020-04-07 至 2020-05-31",
              },
              {
                name: "门店名称",
                value: "门店名称门店名称门店名称门店名",
              },
              {
                name: "已购买人数",
                value: "9999",
              },
              {
                name: "{$购买金额}",
                value: "9999.99",
              },
              {
                name: "最高可抵扣金额",
                value: "9999.99",
              }
            ],
            image: []
          },
          "300": {
            text: [
              {
                name: "活动名称",
                value: "活动名称活动名称活动",
              },
              {
                name: "活动时间",
                value: "2020-04-07 至 2020-05-31",
              },
              {
                name: "门店名称",
                value: "门店名称门店名称门店名称门店名",
              },
              {
                name: "最高可抵扣金额",
                value: "9999",
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
          { name: "正方形", value: "0" },
          { name: "圆形", value: "1" }
        ],
        hasBorder: [
          { name: "无", value: 0 },
          { name: "有", value: 1 }
        ],
        blankViews: {
          viewsMold: 1,
          type: "image",
          changeKeyWords: "",
          text: "",
          url: "",
          css: {
            right: "",
            bottom: "",
            width: "",
            height: ""
          }
        },
        templateData: {
          width: "500",
          height: "875",
          background: "",
          views: [
            {
              viewsMold: 1,
              viewsType: "text",
              type: "image",
              changeKeyWords: "",
              url:
                "https://api.cw100.com//storage/mini_wxcbe60162f9dc451c/2020/04/21/_a=3361&t=kq&sid=87&cid=110100.jpg",
              css: {
                hasBorder: 0,
                right: "28",
                bottom: "122",
                width: "161",
                height: "161",
                borderRadius: "0"
              }
            }
          ]
        }
      },
      customStyle: "",
      baseUrl: "/baseImg"
    };
  },
  computed: {
    viewsLastLength() {
      return this.form.templateData.views.length - 1;
    },
    usePageType() {
      if (this.form.pageType == 2) {
        return this.form.activityType;
      } else {
        return this.form.pageType;
      }
    }
  },
  methods: {
    onImgOk() {
      console.log(111111111);
    },
    changeSmallBg(data) {
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
      // 清空可变字段
      item.changeKeyWords = "";
      //设置默认值
      let cssData
      if(e == 'image'){
        cssData = {
            right: "",
            bottom: "",
            width: "",
            height: ""
        }
      }else{
        cssData = {
            right: "",
            bottom: "",
            width: "",
            height: "",
            lineHeight:'14',
            fontSize:'14',
            textAlign:'left',
            color:'#333',
        }
      }
      item.css = cssData
    },
    changeBorder(e) {
      let cssData = this.deepClone(this.form.templateData.views[this.viewsLastLength].css)
      if (e == 0) {
        delete cssData.borderWidth;
        delete cssData.borderColor;
      } else {
        cssData.borderWidth = "1";
        cssData.borderColor = "#333";
      }
      this.form.templateData.views[this.viewsLastLength].css = cssData;
    },
    addViews(index = 0) {
      this.form.templateData.views.splice(
        index - 1,
        0,
        this.deepClone(this.defaultData.blankViews)
      );
    },
    deleteViews(index) {
      this.form.templateData.views.splice(index, 1);
    },
    upViews(index) {
      let a = this.form.templateData.views[index];
      this.form.templateData.views.splice(index, 1);
      this.form.templateData.views.splice(index - 1, 0, a);
    },
    downViews(index) {
      let a = this.form.templateData.views[index];
      this.form.templateData.views.splice(index, 1);
      this.form.templateData.views.splice(index + 1, 0, a);
    },
    setKeyWords(event, item, type) {
      //将可变字段的值赋给图层
      item[type] = event;
      //将该字段的变量值 加在图层信息上





    },
    deepClone(obj) {
      return JSON.parse(JSON.stringify(obj));
    },
    initTemplate() {
      this.form.templateData = this.deepClone(this.defaultData.templateData);
      this.form.lable = "";
      this.form.activityType = "";
      this.form.smallBg = "";
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
.upload-com {
  position: relative;
  display: flex;
  width: 100px;
  height: 100px;
  border: 1px solid #ececec;
  display: flex;
  justify-content: center;
  .upload-img {
    position: absolute;
    width: initial;
    height: initial;
    max-width: 100px;
    max-height: 100px;
  }
  .icon-qiehuan {
    display: none;
    position: absolute;
    right: 0;
    bottom: 0;
    padding: 2px;
    background-color: rgba(0, 0, 0, 0.4);
  }
}
.upload-com:hover {
  border: 1px solid #4393e5;
  i {
    display: block;
  }
}
.view-item {
  border: 1px solid rgba(232, 232, 232, 1);
  .item-hd {
    display: flex;
    justify-content: space-between;
    height: 35px;
    background-color: rgba(51, 51, 51, 0.117647058823529);
    padding: 5px;
    align-items: center;
  }
  .item-bd {
    padding: 10px;
  }
}
.change-width {
  .el-form-item__content {
    display: flex;
    flex-wrap: wrap;
  }
  .el-input-group {
    width: 45%;
    margin-bottom: 10px;
    margin-right: 10%;
    &:nth-child(2n) {
      margin-right: 0;
    }
  }
}
.el-input-group__append,
.el-input-group__prepend {
  padding: 1px 5px;
}
.G-Mb-10 {
  margin-bottom: 10px !important;
}
</style>
