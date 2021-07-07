<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <!-- 轮播图 -->
      <div>
        <div v-if="recommend.length" class="slider-wrapper" ref="sliderWrapper">
          <slider>
            <div v-for="(item, index) in recommend" :key="index">
              <a :href="item.linkUrl">
                <img class="needsclick" @load="loadingImg" :src="item.picUrl" />
                <!-- better-scroll 在标签里面添加needsclick表明需要点击 -->
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="(item, index) in discList" class="item" @click="selectItem(item)" :key="index">
              <div class="icon">
                <img width="60" height="60" v-lazy="item.imgurl" />
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!-- 推荐歌单 -->
      <div class="recommend-list">
        <h1 class="list-title">热门歌单推荐</h1>
        <ul>
          <li v-for="(item, index) in discList" class="item" v-bind:key="index">
            <div class="icon">
              <img width="60" height="60" v-lazy="item.imgurl" />
            </div>
            <div class="text">
              <h2 class="name" v-html="item.creator.name"></h2>
              <p class="desc" v-html="item.dissname"></p>
            </div>
          </li>
        </ul>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
  import {
    getRecommend,
    getDiscList
  } from 'api/recommend'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {
    playlistMixin
  } from 'assets/js/mixin'
  import Slider from 'base/slider/slider'
  import {
    mapMutations
  } from 'vuex'

  export default {
    mixins: [playlistMixin],
    components: {
      Scroll,
      Loading,
      Slider
    },
    data() {
      return {
        // 推荐歌单列表
        discList: [],
        // 图片加载标志
        checkLoading: false,
        // 轮播图列表
        recommend: []
      }
    },
    created() {
      this._getRecommend()
      this._getDiscList()
    },
    methods: {
      // 获取轮播图数据
      _getRecommend() {
        getRecommend().then(res => {
          if (res.code === 0) {
            this.recommend = res.data.slider
          }
        })
      },
      // 获取推荐列表数据
      _getDiscList() {
        getDiscList().then(res => {
          if (res.code === 0) {
            this.discList = res.data.list
          }
        })
      },
      // 判断轮播图图片是否加载
      loadingImg() {
        if (!this.checkLoading) {
          this.$refs.scroll.refresh()
          this.checkLoading = true
        }
      },
      // 处理点击推荐列表事件
      selectItem(item) {
        this.$router.push({
          path: `/recommend/${item.dissid}`
        })
        this.setDisc(item)
      },
      // 出现mini播放器时，处理轮播部分的高度
      handlePlaylist(playlisy) {
        const bottom = playlisy.length > 0 ? '60px' : ''
        this.$refs.recommend.style.bottom = bottom
        this.$refs.scroll.refresh()
      },
      ...mapMutations({
        setDisc: 'SET_DISC'
      })
    }
  }

</script>

<style scoped lang="less">
  @import '../../assets/css/variable.less';

  .recommend {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;

    .recommend-content {
      height: 100%;
      overflow: hidden;

      .slider-wrapper {
        position: relative;
        width: 100%;
        overflow: hidden;
      }

      .recommend-list {
        .list-title {
          height: 65px;
          line-height: 65px;
          text-align: center;
          font-size: @font-size-medium;
          color: @color-theme;
        }

        .item {
          display: flex;
          box-sizing: border-box;
          align-items: center;
          padding: 0 20px 20px 20px;

          .icon {
            flex: 0 0 60px;
            width: 60px;
            padding-right: 20px;
          }

          .text {
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex: 1;
            line-height: 20px;
            overflow: hidden;
            font-size: @font-size-medium;

            .name {
              margin-bottom: 10px;
              color: @color-text;
            }

            .desc {
              color: @color-text-d;
            }
          }
        }
      }

      .loading-container {
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }

</style>
