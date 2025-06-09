import httpInstance from '@/utils/http'

export const updateUserInfo = (data) => {
    return httpInstance.put('/user/updateUserInfo', data)
}