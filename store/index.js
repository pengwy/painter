import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const state = () => ({
  configData: {apiUrl:'/api',id:'','_token':'xd3gnVYtTsYCTf8DLOQEjE48MjSicP07NbTvCPpd'},
  apiList:{
    getData:'',
    saveData:'',
    uploadImg:'',
  }
})