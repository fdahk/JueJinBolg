import httpInstance from '@/utils/http'
import { useUserStore } from '@/stores/user.js'
// 这样写会在加载文件时，就获取store，此时可能还未准备好
// const userStore = useUserStore()
export const updateUserInfo = (data) => {
    // console.log(data) // 测试
    return httpInstance.put('/user/updateUserInfo', data)
}

// 更新头像-----------------------------------------------
export const updateUserPic = (userPic) => {
    // 在函数内部按需获取 store，避免在文件加载时获取
    const userStore = useUserStore()
    return httpInstance.put('/user/updateUserPic', {userPic: userPic, userPhone: userStore.userPhone})
}