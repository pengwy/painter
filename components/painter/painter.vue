<template>
  <canvas canvas-id="k-canvas" id="k-canvas" class="canvas" />
</template>

<script>
import Pen from "./pen";
import { setInterval } from 'timers';
const util = require("./util");
let screenK = 0.5;
let painierStatus = true
export default {
  name: "HelloWorld",
  mounted() {
    this.setStringPrototype();
    // this.paintCount = 0;
    // this.startPaint();
    // this.getImageInfo();
  },
  props: {
    customStyle: {
      type: String
    },
    paletteDate: {
      type: Object
    },
    dirty: {
      type: Boolean
    }
  },
  data() {
    return {
      picURL: "",
      showCanvas: true,
      painterStyle: {
        width: "",
        height: ""
      },
      palette: ""
    };
  },
  methods: {
    /**
     * 判断一个 object 是否为 空
     * @param {object} object
     */
    isEmpty(object) {
      for (const i in object) {
        return false;
      }
      return true;
    },

    isNeedRefresh(newVal, oldVal) {
      if (!newVal ||this.isEmpty(newVal) ||(this.dirty && util.equal(newVal, oldVal)) || !newVal.background) {
        return false;
      }
      return true;
    },
   async  startPaint() {
      if (this.isEmpty(this.palette)) {
        return;
      }
      if(!painierStatus){
         let status = await this.changePainierStatus()
      }
      console.log('开始');
      painierStatus =false
      screenK = 375 / 750;
      let { width, height } = this.palette;
      const ele = document.getElementById("k-canvas");
      ele.width = width.toPx();
      ele.height = height.toPx();
      const ctx = ele.getContext("2d");
      const pen = new Pen(ctx, this.palette);
      pen.paint(
        () => {
          console.log('完成');
          
          painierStatus = true
        },
        false,
        {}
      );
    },
    changePainierStatus(){
      return new Promise((resolve)=>{
        let a = setInterval(()=>{
          if(painierStatus){
            resolve(true)
          }
        },300)
      })
    },
    async getImageInfo() {
      let paletteCopy = this.palette;
      for (const view of paletteCopy.views) {
        if (view && view.type === "image" && view.url) {
          view = await this.getI(view);
        }
      }
      this.palette = paletteCopy;
      this.startPaint();
    },
    getI(view) {
      return new Promise((resolve, reject) => {
        let img = new Image();
        img.setAttribute("crossOrigin", "anonymous");
        img.onload = function() {
          view.sWidth = img.width;
          view.sHeight = img.height;
          view.el = img;
          resolve(view);
        };
        img.src = view.url;
      });
    },
    setStringPrototype() {
      /* eslint-disable no-extend-native */
      /**
       * 是否支持负数
       * @param {Boolean} minus 是否支持负数
       */
      String.prototype.toPx = function toPx(minus) {
        if (this == "unset") {
          return 0;
        }
        let reg;
        if (minus) {
          reg = /^-?[0-9]+([.]{1}[0-9]+){0,1}(rpx|px)$/g;
        } else {
          reg = /^[0-9]+([.]{1}[0-9]+){0,1}(rpx|px)$/g;
        }
        const results = reg.exec(this + "rpx");
        if (!this || !results) {
          console.error(`The size: ${this} is illegal`);
          return 0;
        }
        const unit = results[2];
        const value = parseFloat(this);

        let res = 0;
        if (unit === "rpx") {
          res = Math.round(value * screenK);
        } else if (unit === "px") {
          res = value;
        }
        return res;
      };
    }
  },
  watch: {
    paletteDate: {
      handler: function(val, oldVal) {
        if (this.isNeedRefresh(val, oldVal)) {
            this.palette = val;
            console.log(val,'val');
            
            this.paintCount = 0;
            this.getImageInfo();
        }
      },
      deep: true
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
