<template>
  <div class="song-list">
    <ul>
      <li class="item" v-for="(song, index) in songs" @click="selectSong(song, index)" :key="index">
        <div class="rank" v-show="rank">
          <span :class="getRankCls(index)" v-text="getRankText(index)"></span>
        </div>
        <div class="content">
          <h2 class="name">{{ song.name }}</h2>
          <p class="desc">{{ getDesc(song) }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
  export default {
    props: {
      songs: {
        type: Array,
        default: function () {
          return []
        }
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      getDesc(song) {
        return `${song.singer}·${song.album}`
      },
      selectSong(song, index) {
        this.$emit('select', song, index)
      },
      getRankCls(index) {
        if (index <= 2) {
          return `icon icon${index}`
        } else {
          return 'text'
        }
      },
      getRankText(index) {
        if (index > 2) {
          return index + 1
        }
      }
    }
  }

</script>

<style scoped lang="less">
  @import '../../assets/css/variable';
  @import '../../assets/css/mixin';

  .song-list {
    .item {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      height: 64px;
      font-size: @font-size-medium;

      .rank {
        flex: 0 0 25px;
        width: 25px;
				margin-left: 15px;
        text-align: center;

        .icon {
          display: inline-block;
          width: 25px;
          height: 24px;
          background-size: 25px 24px;

          &.icon0 {
            background-image: url('first@2x.png');

            @media (-webkit-min-device-pixel-ratio: 3) and (min-device-pixel-ratio: 3) {
              background-image: url('first@3x.png')
            }
          }

          &.icon1 {
            background-image: url('second@2x.png');

            @media (-webkit-min-device-pixel-ratio: 3) and (min-device-pixel-ratio: 3) {
              background-image: url('second@3x.png')
            }
          }

          &.icon2 {
            background-image: url('third@2x.png');

            @media (-webkit-min-device-pixel-ratio: 3) and (min-device-pixel-ratio: 3) {
              background-image: url('third@3x.png')
            }
          }
        }

        .text {
          color: @color-theme;
          font-size: @font-size-large;
        }
      }

      .content {
				margin-left: 15px;
        flex: 1;
        line-height: 20px;
        overflow: hidden;

        .name {
          .no-wrap();
          color: @color-text;
        }

        .desc {
          .no-wrap();
          margin-top: 4px;
          color: @color-text-d;
        }
      }
    }
  }

</style>
