<!-- 
  - 使用 validation.js 进行表单验证
  - 调用 profile.js API 进行数据操作
  - 通过 toast.js 显示操作结果
  - 响应式数据驱动 UI 更新
-->
<script setup>
import { ref, reactive, onMounted } from 'vue'
// 表单验证工具导入
import ValidationUtils from '@/utils/validation.js'
// 通知系统导入
import { showSuccess, showError } from '@/utils/toast.js'
// 用户信息存储导入
import { useUserStore } from '@/stores/user.js'
const userStore = useUserStore()
import { updateUserInfo, updateUserPic } from '@/apis/user.js'
/**
 * - reactive() 创建响应式对象，对象属性变化会触发视图更新
 * - 对象字面量语法定义初始数据结构
 * - 响应式特性确保数据变化时UI自动更新
 * - 被验证函数读取进行实时验证
 * - 提交时被 API 函数调用发送到服务器
 */

const formData = reactive({
  userName: `${userStore.userName}`,        // 用户名，必填字段
  startWorkDate: `${userStore.startWorkDate}`,  // 开始工作时间，必填字段
  profession: `${userStore.profession}`,     // 职业方向，必填字段
  position: `${userStore.position}`,              // 职位，可选字段
  company: `${userStore.company}`,               // 公司，可选字段
  website: `${userStore.website}`,               // 个人主页，可选字段
  introduction: `${userStore.introduction}`,      // 个人介绍，可选字段
  userPhone: `${userStore.userPhone || ''}`       // 用户手机号，用于标识用户
})

/**
 * - 数组用于存储文件列表（备用）
 * - fileList 备用的文件列表存储
 * - 与文件上传组件交互
 * - 用于头像预览显示
 * - 提交时包含在表单数据中
 */
const userPicUrl = ref('')    // 头像URL的响应式引用
const fileList = ref([])      // 文件列表的响应式引用（备用）

/**
 * 职业方向选项配置
 * - 数组字面量语法定义选项列表
 * - 字符串元素代表可选的职业方向
 * - 为职业方向下拉框提供选项数据
 * - 限制用户只能从预定义选项中选择
 * - 便于后续维护和扩展选项
 * - 在模板中通过 v-for 渲染下拉选项
 * - 与 profession 字段的验证逻辑配合
 * - 确保选择值的有效性
 */
const professionOptions = [
  '前端开发',      // Web前端开发工程师
  '后端开发',      // 服务器端开发工程师
  '全栈开发',      // 全栈开发工程师
  '移动端开发',    // 移动应用开发工程师
  'UI/UX设计',    // 用户界面和体验设计师
  '产品经理',      // 产品管理岗位
  '数据分析',      // 数据分析师
  '运维工程师',    // 系统运维工程师
  '测试工程师'     // 软件测试工程师
]

// 表单验证错误状态
const formErrors = reactive({
  userName: '',
  startWorkDate: '',
  profession: '',
  position: '',
  company: '',
  website: '',
  introduction: ''
})

const showSuccessMessage = (message) => {
  showSuccess(message)
}

const showErrorMessage = (message) => {
  showError(message)
}

const clearError = (field) => {
  formErrors[field] = ''
}

const setError = (field, message) => {
  formErrors[field] = message
}

/**
 * 用户名实时验证函数

 * - 被用户名输入框的 @input 和 @blur 事件调用
 * - 调用 setError/clearError 函数管理错误状态
 * - 错误信息显示在输入框下方

 * @param {string} value - 要验证的用户名值
 * @returns {boolean} 验证是否通过
 */
const validateUserName = (value) => {
  // 检查值是否为空或只包含空白字符
  if (!value || !value.trim()) {
    setError('userName', '请填写用户名')    // 设置必填错误信息
    return false
  }
  
  // 检查最小长度限制
  if (value.trim().length < 2) {
    setError('userName', '用户名至少需要2个字符')  // 设置最小长度错误
    return false
  }
  
  // 检查最大长度限制
  if (value.trim().length > 20) {
    setError('userName', '用户名不能超过20个字符')  // 设置最大长度错误
    return false
  }
  
  // 验证通过，清除错误信息
  clearError('userName')
  return true  // 返回验证成功
}

// 验证开始工作时间
const validateStartWorkDate = (value) => {
  if (!value) {
    setError('startWorkDate', '请选择开始工作时间')
    return false
  }
  
  const selectedDate = new Date(value)
  const currentDate = new Date()
  
  if (selectedDate > currentDate) {
    setError('startWorkDate', '开始工作时间不能晚于当前时间')
    return false
  }
  
  clearError('startWorkDate')
  return true
}

// 验证职业方向
const validateProfession = (value) => {
  if (!value) {
    setError('profession', '请选择职业方向')
    return false
  }
  clearError('profession')
  return true
}

// 验证职位
const validatePosition = (value) => {
  if (value && value.length > 50) {
    setError('position', '职位名称不能超过50个字符')
    return false
  }
  clearError('position')
  return true
}

// 验证公司
const validateCompany = (value) => {
  if (value && value.length > 50) {
    setError('company', '公司名称不能超过50个字符')
    return false
  }
  clearError('company')
  return true
}

// 验证个人主页
const validateWebsite = (value) => {
  if (value && value.length > 100) {
    setError('website', 'URL不能超过100个字符')
    return false
  }
  
  if (value && value.trim()) {
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
    if (!urlPattern.test(value.trim())) {
      setError('website', '请输入有效的网址格式')
      return false
    }
  }
  
  clearError('website')
  return true
}

// 验证个人介绍
const validateIntroduction = (value) => {
  if (value && value.length > 100) {
    setError('introduction', '个人介绍不能超过100个字符')
    return false
  }
  clearError('introduction')
  return true
}

// 头像上传前验证
const beforeUserPicUpload = (file) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
  // 大小限制 5M
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isJPG) {
    showErrorMessage('头像只能是 JPG、PNG、JPEG 格式!')
    return false
  }
  if (!isLt5M) {
    showErrorMessage('头像大小不能超过 5MB!')
    return false
  }
  return true
}

// 处理文件选择
const handleFileChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  if (beforeUserPicUpload(file)) {
    try {
      // 调试信息
      // console.log('📷 开始处理头像上传...')
      // console.log('文件信息:', {
      //   name: file.name,
      //   size: file.size,
      //   type: file.type
      // })
      // console.log('当前用户手机号:', userStore.userPhone)
      
      // 将文件转换为Base64格式
      const base64Data = await convertFileToBase64(file)
      console.log('Base64数据长度:', base64Data.length)
      console.log('Base64前缀:', base64Data.substring(0, 50) + '...')
      
      // 检查userPhone是否存在
      if (!userStore.userPhone) {
        throw new Error('用户手机号不存在，请重新登录')
      }
      
      // 调用API上传头像
      const result = await updateUserPic(base64Data)
      console.log('API响应:', result)
      
      if (result.data && result.data.code === 200) {
        // 更新本地头像显示
        userPicUrl.value = base64Data
        // 更新store中的头像
        userStore.userPic = base64Data
        showSuccessMessage(result.data.message || '头像上传成功')
        console.log('✅ 头像上传成功!')
      } else {
        console.error('❌ API返回失败:', result.data)
        showErrorMessage(result.data?.message || '头像上传失败')
      }
    } catch (error) {
      console.error('❌ 头像上传失败:', error)
      
      // 根据错误类型显示不同的错误信息
      if (error.message.includes('用户手机号不存在')) {
        showErrorMessage('用户身份验证失败，请重新登录')
      } else if (error.response) {
        console.error('HTTP错误:', error.response.status, error.response.data)
        showErrorMessage(`服务器错误：${error.response.data?.message || '未知错误'}`)
      } else if (error.code === 'NETWORK_ERROR') {
        showErrorMessage('网络连接失败，请检查网络连接')
      } else {
        showErrorMessage(`头像上传失败：${error.message || '请稍后重试'}`)
      }
    }
  }
}

// 将文件转换为Base64格式
const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      resolve(e.target.result) // 返回 data:image/jpeg;base64,xxx 格式
    }
    reader.onerror = (error) => {
      reject(error)
    }
    reader.readAsDataURL(file)
  })
}

// 获取头像URL，注意避免null/undefined问题
const getSafeUserPicUrl = (userPic) => {
  return (userPic && userPic !== 'null' && userPic !== 'undefined' && userPic.trim() !== '') 
    ? userPic 
    : 'src/assets/images/B.jpg'
}

// 验证整个表单
const validateForm = () => {
  const userNameValid = validateUserName(formData.userName)
  const startWorkDateValid = validateStartWorkDate(formData.startWorkDate)
  const professionValid = validateProfession(formData.profession)
  const positionValid = validatePosition(formData.position)
  const companyValid = validateCompany(formData.company)
  const websiteValid = validateWebsite(formData.website)
  const introductionValid = validateIntroduction(formData.introduction)
  
  return userNameValid && startWorkDateValid && professionValid && 
         positionValid && companyValid && websiteValid && introductionValid
}

/**
 * 保存个人资料修改
 * - 执行完整的表单验证
 * 表单提交按钮的点击事件调用
 * - 调用 validateForm() 进行最终验证
    格式化数据
 */
const saveProfile = async () => {
  // 执行完整的表单验证，如果有错误则提前返回
  if (!validateForm()) {
    showErrorMessage('请修正表单中的错误信息')
    return  // 提前返回，避免执行后续保存逻辑
  }
  // console.log(formData.userPhone) // 测试
  try {
    // 格式化表单数据，去除多余空白并处理null值
    const cleanFormData = {
      userName: formData.userName.trim(),
      startWorkDate: formData.startWorkDate,
      profession: formData.profession,
      position: formData.position?.trim() || '',
      company: formData.company?.trim() || '',
      website: formData.website?.trim() || '',
      introduction: formData.introduction?.trim() || '',
      userPhone: formData.userPhone
    }
    // console.log(cleanFormData.userPhone) // 测试
    // 更新至后端数据库
    const result = await updateUserInfo(cleanFormData)
    
    // 根据API返回结果进行相应处理
    if (result.data && result.data.code === 200) {
      // 保存成功，显示成功消息
      showSuccessMessage(result.data.message || '保存成功')
      // 使用updateUserInfo方法更新用户信息
      userStore.updateUserInfo(cleanFormData)
      console.log('保存成功:', result)  // 控制台记录成功日志
    } else {
      // API返回失败状态，显示错误消息
      showErrorMessage(result.data?.message || '保存失败')
      console.error('保存失败:', result)
    }
  } catch (error) {
    // 捕获网络错误、解析错误等异常情况
    console.error('保存失败:', error)  // 控制台记录错误日志
    
    // 根据错误类型显示不同的错误信息
    if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
      showErrorMessage('网络连接失败，请检查网络连接')
    } else if (error.response?.status === 500) {
      showErrorMessage('服务器内部错误，请稍后重试')
    } else {
      showErrorMessage('保存失败，请稍后重试')  // 显示用户友好的错误信息
    }
  }
}

// 重置表单
const resetForm = () => {
  // 安全地从userStore获取数据，避免null值被转换为字符串"null"
  const safeGetValue = (value) => value && value !== 'null' && value !== 'undefined' ? value : ''
  
  // Object.assign 方法用于将一个或多个对象的属性复制到目标对象
  Object.assign(formData, {
    userName: safeGetValue(userStore.userName),
    startWorkDate: safeGetValue(userStore.startWorkDate),
    profession: safeGetValue(userStore.profession),
    position: safeGetValue(userStore.position),
    company: safeGetValue(userStore.company),
    website: safeGetValue(userStore.website),
    introduction: safeGetValue(userStore.introduction),
    userPhone: safeGetValue(userStore.userPhone)
  })
  // 安全地重置头像URL
  userPicUrl.value = getSafeUserPicUrl(userStore.userPic)
  
  // 清除所有错误信息
  Object.keys(formErrors).forEach(key => {
    formErrors[key] = ''
  })
  
  showSuccessMessage('已重置')
}

// 初始化数据
const initializeData = async () => {
  try {
    Object.assign(formData, userStore)
    // console.log(userStore) // 测试
    // console.log(formData) // 测试
    // 安全地设置头像URL，避免null/undefined被转换为字符串
    userPicUrl.value = getSafeUserPicUrl(userStore.userPic) 
    // console.log(userPicUrl.value) //调试
  } catch (error) {
    console.error('初始化数据失败:', error)
    showErrorMessage('初始化数据失败，请刷新页面重试')
  }
}

// 组件挂载时初始化数据
onMounted(() => {
  initializeData()
})
</script>

<template>
  <div class="profileContainer">
    <div class="profileBox">
      <div class="profileBoxHead"><h2>个人资料</h2></div>
      <div class="profileBoxBody">
        <!-- 左侧信息框 -->
        <div class="profileBoxLeft">
          <div class="infoFormBox">
            <div class="infoFormHead">基本信息</div>
            <!--表单 -->
            <!-- 要阻止提交默认行为 -->
            <form @submit.prevent="saveProfile">
              <!-- 用户名 -->
              <div class="formItem">
                <div class="formLabel">
                  <!-- 必填项 -->
                  <span class="required">*</span>用户名
                </div>
                <div class="formContent">
                  <input 
                    type="text" 
                    v-model="formData.userName" 
                    placeholder="请输入用户名"
                    maxlength="20"
                    :class="{ 'error': formErrors.userName }"
                    @input="validateUserName(formData.userName)"
                    @blur="validateUserName(formData.userName)"
                  >
                  <!-- 长度限制 -->
                  <div class="characterCount">{{ formData.userName.length }}/20</div>

                </div>
                <!-- 错误提示 -->
                 <div class="errorContainer">
                    <div v-if="formErrors.userName" class="errorMessage">
                      {{ formErrors.userName }}
                    </div>                    
                 </div>
              </div>

              <!-- 开始工作时间 -->
              <div class="formItem">
                <div class="formLabel">
                  <span class="required">*</span>开始工作
                </div>
                <div class="formContent">
                  <input 
                    type="month" 
                    v-model="formData.startWorkDate"
                    :class="{ 'error': formErrors.startWorkDate }"
                    @change="validateStartWorkDate(formData.startWorkDate)"
                    @blur="validateStartWorkDate(formData.startWorkDate)"
                  >

                </div>
                  <!-- 错误提示 -->
                <div class="errorContainer">
                  <div v-if="formErrors.startWorkDate" class="errorMessage">
                    {{ formErrors.startWorkDate }}
                  </div>                    
                </div>                
              </div>

              <!-- 职业方向 -->
              <div class="formItem">
                <div class="formLabel">
                  <span class="required">*</span>职业方向
                </div>
                <div class="formContent">
                  <select 
                    v-model="formData.profession"
                    :class="{ 'error': formErrors.profession }"
                    @change="validateProfession(formData.profession)"
                  >
                    <option v-for="option in professionOptions" :key="option" :value="option">
                      {{ option }}
                    </option>
                  </select>
                </div>
                <!-- 错误提示 -->
                <div class="errorContainer">
                  <div v-if="formErrors.profession" class="errorMessage">
                    {{ formErrors.profession }}
                  </div>                    
                </div>                
              </div>

              <!-- 职位 -->
              <div class="formItem">
                <div class="formLabel">职位</div>
                <div class="formContent">
                  <input 
                    type="text" 
                    v-model="formData.position" 
                    placeholder="请输入你的职位"
                    maxlength="50"
                    :class="{ 'error': formErrors.position }"
                    @input="validatePosition(formData.position)"
                    @blur="validatePosition(formData.position)"
                  >
                  <div class="characterCount">{{ formData.position.length }}/50</div>

                </div>
                  <!-- 错误提示 -->
                  <div class="errorContainer">
                    <div v-if="formErrors.position" class="errorMessage">
                      {{ formErrors.position }}
                    </div>                    
                  </div>                
              </div>

              <!-- 公司 -->
              <div class="formItem">
                <div class="formLabel">公司</div>
                <div class="formContent">
                  <input 
                    type="text" 
                    v-model="formData.company" 
                    placeholder="请输入你的公司"
                    maxlength="50"
                    :class="{ 'error': formErrors.company }"
                    @input="validateCompany(formData.company)"
                    @blur="validateCompany(formData.company)"
                  >
                  <div class="characterCount">{{ formData.company.length }}/50</div>

                </div>
                  <!-- 错误提示 -->
                  <div class="errorContainer">
                    <div v-if="formErrors.company" class="errorMessage">
                      {{ formErrors.company }}
                    </div>                    
                  </div>                
              </div>

              <!-- 个人主页 -->
              <div class="formItem">
                <div class="formLabel">个人主页</div>
                <div class="formContent">
                  <!-- url类型输入框 -->
                  <input 
                    type="url" 
                    v-model="formData.website" 
                    placeholder="请输入你的个人主页"
                    maxlength="100"
                    :class="{ 'error': formErrors.website }"
                    @input="validateWebsite(formData.website)"
                    @blur="validateWebsite(formData.website)"
                  >
                  <div class="characterCount">{{ formData.website.length }}/100</div>
           
                </div>
                  <!-- 错误提示 -->
                  <div class="errorContainer">
                    <div v-if="formErrors.website" class="errorMessage">
                      {{ formErrors.website }}  
                    </div>                    
                  </div>                     
              </div>

              <!-- 个人介绍 -->
              <div class="formItem">
                <div class="formLabel">个人介绍</div>
                <div class="formContent">
                  <textarea 
                    v-model="formData.introduction" 
                    placeholder="请填写职业技能、擅长的事情、兴趣爱好等"
                    maxlength="100"
                    rows="4"
                    :class="{ 'error': formErrors.introduction }"
                    @input="validateIntroduction(formData.introduction)"
                    @blur="validateIntroduction(formData.introduction)"
                  ></textarea>
                  <div class="characterCount">{{ formData.introduction.length }}/100</div>
              
                </div>
                  <!-- 错误提示 -->
                  <div class="errorContainer">
                    <div v-if="formErrors.introduction" class="errorMessage">
                      {{ formErrors.introduction }}
                    </div>                    
                  </div>                  
              </div>

              <!-- 按钮 -->
              <div class="formButtons">
                <button type="button" @click="resetForm" class="resetBtn">重置</button>
                <button type="submit" class="saveBtn">保存修改</button>
              </div>
            </form>
          </div>
        </div>
        
        <!-- 右侧头像上传 -->
        <div class="profileBoxRight">
          <div class="userPicUploadBox">
            <div class="userPicContainer">
              <div class="userPicPreview" :class="{ 'has-userPic': userPicUrl }">
                <img v-if="userPicUrl" :src="userPicUrl" alt="头像预览" />
                <div v-else class="userPicPlaceholder">
                  <!-- i是图标 -->
                  <i class="upload-icon">📷</i>
                </div>
              </div>
              <div class="uploadButton">
                <!-- 经典的自定义文件上传按钮的实现方式 input+button 方案-->
                 <!-- 优势：样式可控性高、浏览器兼容性好 -->
                <input 
                  type="file" 
                  @change="handleFileChange" 
                  accept="image/jpeg,image/png,image/jpg"
                  ref="fileInput"
                  style="display: none"
                >
                <!-- 通过 Vue 的 $refs 访问名为 fileInput 的 DOM 元素，并触发其 click() 方法 -->
                <button type="button" @click="$refs.fileInput.click()" class="uploadBtn">
                  上传头像
                </button>
              </div>
            </div>
            <div class="uploadTips">
              <div>格式：支持JPG、PNG、JPEG</div>
              <div>大小：5M以内</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .profileContainer {
    flex: 1;
    // height: 100%;
    display: flex;
    flex-direction: column;
    margin-left: 20px;
    background-color: white;
    border-radius: 5px;
  }
  
  .profileBox {
    display: flex;
    width: 100%;
    // height: 100%;
    flex-direction: column;
  }
  
  .profileBoxHead {
    display: flex;
    width: 100%;
    height: 50px;
    padding: 16px 24px;
    color: rgba(0, 0, 0, .8);
    font-weight: 500;
    border-bottom: 1px solid rgba(0, 0, 0, .1);
    align-items: center;
    
    h2 {
      margin: 0;
      font-size: 18px;
    }
  }
  
  .profileBoxBody {
    display: flex;
    width: 100%;
    flex: 1;
    flex-direction: row;
    
    .profileBoxLeft {
      display: flex;
      width: 70%;
      height: 100%;
      flex-direction: column;
      padding: 24px;
    }
    
    .profileBoxRight {
      display: flex;
      width: 30%;
      height: 100%;
      flex-direction: column;
      padding: 24px;
      border-left: 1px solid rgba(0, 0, 0, .1);
    }
  }
  
  .infoFormBox {
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    
    .infoFormHead {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 24px;
      color: rgba(0, 0, 0, .8);
    }
    
    form {
      display: flex;
      flex-direction: column;
    }
  }
  
  .formItem {
    display: flex;
    align-items: flex-start; //顶部对齐不好看，改成居中对齐
    // align-items: center;
    // gap: 16px;
    flex-wrap: wrap;
    .formLabel {
      min-width: 80px;
      color: rgba(0, 0, 0, .8);
      font-size: 14px;
      line-height: 40px;
      
      .required {
        color: #ff4757;
        margin-right: 4px;
      }
    }
    
    .formContent {
      flex: 1;
      position: relative;
      
      input, select, textarea {
        width: 90%;
        padding: 8px 12px;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        font-size: 14px;
        transition: border-color 0.2s;
        
        &:focus {
          outline: none;
          border-color: #1890ff;
        }
        
        &::placeholder {
          color: #bfbfbf;
        }
        
        &.error {
          border-color: #ff4757;
          
          &:focus {
            border-color: #ff4757;
          }
        }
      }
      
      select {
        cursor: pointer;
        background-color: white;
      }
      
      textarea {
        resize: vertical;
        min-height: 80px;
        line-height: 1.5;
      }
      
      .characterCount {
        // position: absolute;
        display: inline-block;
        white-space: nowrap;
        margin-left: 8px;
        // right: 8px;
        // bottom: -20px;
        font-size: 12px;
        color: #bfbfbf;
      }
      

    }
    .errorContainer {
      flex-basis: 100%;
      height: 20px;
      margin-left: 80px;
      // margin-top: 4px;
      overflow: hidden;   
      .errorMessage {
        // margin-top: 4px;
        font-size: 12px;
        color: #ff4757;
        line-height: 1.4;
      }
    }
  }
  
  .formButtons {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 32px;
    
    button {
      padding: 8px 24px;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
      border: 1px solid;
      transition: all 0.2s;
      
      &.resetBtn {
        background-color: white;
        color: #666;
        border-color: #d9d9d9;
        
        &:hover {
          color: #1890ff;
          border-color: #1890ff;
        }
      }
      
      &.saveBtn {
        background-color: #1890ff;
        color: white;
        border-color: #1890ff;
        
        &:hover {
          background-color: #40a9ff;
        }
      }
    }
  }
  
  .userPicUploadBox {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    
    .userPicContainer {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      
      .userPicPreview {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        border: 2px dashed #d9d9d9;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        transition: border-color 0.2s;
        
        &.has-userPic {
          border: 2px solid #1890ff;
        }
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .userPicPlaceholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          color: #bfbfbf;
          
          .upload-icon {
            font-size: 32px;
            margin-bottom: 8px;
          }
        }
      }
      
      .uploadButton {
        .uploadBtn {
          padding: 8px 20px;
          background-color: white;
          border: 1px solid #1890ff;
          color: #1890ff;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
          
          &:hover {
            background-color: #1890ff;
            color: white;
          }
        }
      }
    }
    
    .uploadTips {
      font-size: 12px;
      color: #bfbfbf;
      text-align: center;
      line-height: 1.5;
    }
  }
</style>