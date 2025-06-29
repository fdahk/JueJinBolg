<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 导航到写文章页面
const toWrite = () => {
  router.push('/creator/write')
}
// 切换内容管理菜单
const showContentMenue = ref(true)
const toggleContentMenue = () => {
  showContentMenue.value = !showContentMenue.value
}
const isContentMenueActive = computed(() => {
    // return route.path.startsWith('/creator/contentManage')
  return router.currentRoute.value.path.includes('/creator/contentManage')
})

// 切换数据统计菜单
const showDataMenue = ref(true)

const toggleDataMenue = () => {
  showDataMenue.value = !showDataMenue.value
}
const isDataMenueActive = computed(() => {
    return router.currentRoute.value.path.includes('/creator/dataManage')
})
</script>

<template>
    <div class="creator-center-container">
        <!-- 左侧导航 -->
        <div class="creator-center-left">
            <div class="left-nav-container">
                <!-- 写文章 -->
                <div class="write-article-btn" @click="toWrite">
                    <span>写文章</span>
                </div>
                <!-- 创作者首页 -->
                <router-link to="/creator/center" class="nav-item home-item" active-class="vagueActive">
                    <i class="iconfont icon-home"></i>
                    <span>首页</span>
                </router-link>
                <!-- 内容管理菜单 -->
                <div class="nav-group">
                <div class="nav-item group-header" @click="toggleContentMenue" :class="{ 'vagueActive': isContentMenueActive }">
                    <div class="header-left">
                        <i class="iconfont icon-folder"></i>
                        <span>内容管理</span>
                    </div>
                    <i class="iconfont icon-down" v-show="!showContentMenue"></i>
                    <i class="iconfont icon-up" v-show="showContentMenue"></i>
                </div>
                
                <!-- 子菜单 -->
                <div class="sub-menu" :class="{ 'expanded': showContentMenue }">
                    <router-link to="/creator/contentManage/articleManage" class="sub-menu-item" active-class="vagueActive">
                        <span>文章管理</span>
                    </router-link>
                    <router-link to="/creator/contentManage/columnManage" class="sub-menu-item" active-class="vagueActive">
                        <span>专栏管理</span>
                    </router-link>
                </div>
                </div>
                <!-- 数据统计 -->
                <div class="nav-group">
                <!-- to必须写，阻止默认行为就可以了 -->
                <div class="nav-item group-header" @click="toggleDataMenue" :class="{ 'vagueActive': isDataMenueActive }">
                    <div class="header-left">
                        <i class="iconfont icon-Report"></i>
                        <span>数据统计</span>
                    </div>
                    <i class="iconfont icon-down" v-show="!showDataMenue"></i>
                    <i class="iconfont icon-up" v-show="showDataMenue"></i>
                </div>
                
                <!-- 子菜单 -->
                <div class="sub-menu" :class="{ 'expanded': showDataMenue }">
                    <router-link to="/creator/dataManage/contentData" class="sub-menu-item" active-class="vagueActive">
                        <span>内容数据</span>
                    </router-link>
                    <router-link to="/creator/dataManage/fansData" class="sub-menu-item" active-class="vagueActive">
                        <span>粉丝数据</span>
                    </router-link>
                </div>
                </div>
            </div>
        </div>
        <!-- 三级路由 -->
        <router-view />
    </div>
</template>

<style scoped lang="scss">
.creator-center-container {
    display: flex;
    align-items: flex-start;
    min-height: 100vh;
    margin-top: 20px;
}

.creator-center-left {
    width: 200px;
    // height: 100%;
    background-color: #fff;
    border-right: 1px solid #e9ecef;
    flex-shrink: 0;
    margin-right: 20px;
}

.left-nav-container {
    padding: 16px 12px;
    width: 100%;
    // 写文章按钮
    .write-article-btn {
        width: 100%;
        height: 44px;
        background: linear-gradient(135deg, $primaryColor 0%, #40a9ff 100%);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        margin-bottom: 16px;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
        
        span {
            color: white;
            font-size: 16px;
            font-weight: 500;
        }
        
        &:hover {
            background: linear-gradient(135deg, #096dd9 0%, $primaryColor 100%);
            box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
        }
        
    }
    
    // 导航项通用样式
    .nav-item {
        display: flex;
        align-items: center;
        height: 48px;
        padding: 0 16px;
        border-radius: 6px;
        cursor: pointer;
        margin-bottom: 4px;
        
        span {
            font-size: 14px;
            color: #333;
        }
        
        &:hover {
            background-color: rgba($primaryColor, 0.1);
            span {
                color: $primaryColor;
            }
        }
    }
    // 导航组
    .nav-group {
        margin-top: 8px;
        
        .group-header {
            justify-content: space-between;
            font-weight: 500;
            
            .header-left {
                display: flex;
                align-items: center;
            }
        }
        
        // 子菜单
        .sub-menu {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
            
            &.expanded {
                max-height: 200px;
            }
            
            .sub-menu-item {
                display: flex;
                align-items: center;
                height: 40px;
                padding: 0 16px 0 48px;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.2s ease;
                text-decoration: none;
                margin-bottom: 2px;
                
                span {
                    font-size: 14px;
                    color: #666;
                }
                
                &:hover {
                    background-color: rgba($primaryColor, 0.1);
                    
                    span {
                        color: $primaryColor;
                    }
                }
                
            }
        }
    }
}

.creator-center-right {
    flex: 1;
    padding: 24px;
    overflow-y: auto;
}

// 统一字体图标样式
.iconfont {
    font-size: 18px;
    margin-right: 12px;
    color: #666;
}
//统一激活样式
.vagueActive {
    background-color: rgba($primaryColor, 0.1);
    span {
        color: $primaryColor;
    }
}
// 响应式设计
@media (max-width: 768px) {
    .creator-center-container {
        flex-direction: column;
    }
    
    .creator-center-left {
        width: 100%;
        border-right: none;
        border-bottom: 1px solid #e9ecef;
    }
    
    .left-nav-container {
        padding: 16px;
        
        .nav-item, .sub-menu-item {
            height: 44px;
        }
    }
}
</style>