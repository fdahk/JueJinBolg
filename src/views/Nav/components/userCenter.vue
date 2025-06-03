<script setup>
  import {ref,onMounted} from 'vue'
  const showMenue = ref(false)
  const changeShowMenue = () => {
    showMenue.value = !showMenue.value
  }
  const handleClick = (e) => {
    const userCenterEle = document.querySelector('.userCenter img')
    const menueEle = document.querySelector('.menue')
    if(!userCenterEle?.contains(e.target) && !menueEle?.contains(e.target)) 
      showMenue.value = false
  }
  onMounted(() => {
    document.addEventListener('click', handleClick)
  })
</script>

<template>
  <div class="userBox">
    <div class="userCenter"> 
      <img src="@\assets\images\B.jpg" alt="" @click="changeShowMenue()" id=""> 
      
    </div>    
    <div class="menue" v-show="showMenue">
      <div class="menueHead">
        <div class="menueHeadLeft">
          <img src="@\assets\images\B.jpg" alt="">
        </div>
        <div class="menueHeadRight">
          <div class="menueUserName">
            <span>陈冠希</span>
          </div>
          <div class="menueUserRank">
            <span>lv100</span>
          </div>
        </div>
      </div>
      <div class="menueUserInfo">
        
      </div>
    </div>
  </div>
  
</template>

<style scoped lang="scss">
  .userBox {
    height: 100%;
    width: 50px;
    display: flex;
    align-items: center;
    // position: absolute;
    // padding: 8px 0 8px 0;
    // right: 20px;
    margin-left: auto;
  }
  .userCenter {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      cursor: pointer;
    }
  }
  .menue {
    background-color: white;
    width: 250px;
    height: 350px;
    padding: 8px 8px 8px 8px;
    position: absolute;
    top: 100%;
    right: 20%;
    border: 1px rgba(76, 74, 74,.2) solid;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    .menueHead {
      width: 100%;
      height: 65px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .menueHeadLeft {
        width: 55px;
        height: 55px;
        border-radius: 50%;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .menueHeadRight {
        flex: 1;
        height:  100%;
        display: flex;
        flex-direction: column;
        .menueUserName {
          span {
             font-size: 1.2rem;
            //  color: rgba(9, 9, 9, .9);
          }
        }
        .menueUserRank {
          span {
            color: rgb(230, 13, 13);
          }
        }
      } 
    }
  }
</style>