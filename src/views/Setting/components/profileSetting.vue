<script setup>

</script>

<template>
  <div class="profileContainer">
    <div class="profileBox">
      <div class="profileBoxHead"><h2>个人资料</h2></div>
      <div class="profileBoxBody">
        <div class="profileBoxLeft">
          L
        </div>
        <div class="profileBoxRight">
          R
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped lang="scss">
  .profileContainer {
    flex: 1;
    height: 100%;
    margin-left: 20px;
    background-color: white;
    border-radius: 5px;
  }
  .profileBox {
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
  }
  .profileBoxBody {
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: row;
    .profileBoxLeft {
      display: flex;
      width: 70%;
      height: 100%;
      flex-direction: column;
    }
  }
</style>