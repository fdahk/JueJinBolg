<script setup>
import { ref, reactive, onMounted } from 'vue'
import RichTextEditor from './components/RichTextEditor.vue'
import { showToast } from '@/utils/toast'
import articleApi from '@/apis/article'
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
const article = reactive({
  title: '',
  content: '',
  articleId: ''
})

const showPublishForm = ref(false)
const publishForm = reactive({
  summary: '',
  tag: '',
  category: '',
  cover: ''
})

const availableTags = ref([ '综合', '后端', '前端', 'Android', 'iOS', '人工智能', '开发工具', '代码人生', '阅读','none','数据库','算法','面试','工具','其他'])
const categories = ref([
  { id:1, name: '前端'},
  { id:2, name: '后端'},
  { id:3, name: '人工智能'},
  { id:4, name: '开发工具'},
  { id:5, name: '代码人生'},
  { id:6, name: '阅读'},
  { id:7, name: '综合'}
])

// 内容变化时，自动保存草稿
const handleContentChange = (content) => {
  // 自动保存草稿
}



// 保存草稿
const saveDraft = async () => {
  if (!article.title.trim()) {
    showToast('请输入文章标题')
    return
  }
  
  try {
    const res = await articleApi.createArticle(
      {
        ...article,
        ...publishForm,
        status: 'draft',
        // createTime: new Date(),
        // updateTime: new Date(),
        userPhone: userStore.userPhone,
        author: userStore.userName
      }
    )
    if(res.data.code === 200){
      console.log('保存草稿', article)
      showToast('草稿保存成功')
    }else{
      showToast('草稿保存失败')
    }
  } catch (error) {
    console.error('保存草稿失败', error)
  }
}

// 发布文章
const publishArticle = () => {
  if (!article.title.trim()) {
    showToast('请输入文章标题')
    return
  }
  if (!article.content.trim()) {
    showToast('请输入文章内容')
    return
  }
  showPublishForm.value = true
}

// 确认发布
const confirmPublish = async () => {
  try {
    const publishData = {
      ...article,
      ...publishForm,
      status: 'published',
      articleId: article.articleId,
      userPhone: userStore.userPhone,
      author: userStore.userName
    }
    // 如果文章id存在，则更新文章，否则创建文章
    let res = null
    if(article.articleId){
      res = await articleApi.updateArticle(publishData)
    }else{
      res = await articleApi.createArticle(publishData)
    }
    if(res.data.code === 200){
      showToast('文章发布成功')
    }else{
      showToast('文章发布失败')
    }
    showPublishForm.value = false

  } catch (error) {
    showToast('发布失败')
    console.error('发布失败', error)
  }
}

onMounted(() => {
  // 从草稿箱恢复内容
  const draft = localStorage.getItem('article_draft')
  if (draft) {
    const draftData = JSON.parse(draft)
    article.title = draftData.title || ''
    article.content = draftData.content || ''
  }
})
</script> 

<template>
    <div class="write-article">
      <div class="article-header">
        <el-input
          v-model="article.title"
          placeholder="输入文章标题..."
          class="title-input"
          size="large"
        />
        
        <div class="header-actions">
          <el-button @click="saveDraft">草稿箱</el-button>
          <el-button type="primary" @click="publishArticle">发布</el-button>
        </div>
      </div>
      
      <!-- 富文本编辑器 -->
      <div class="article-editor">
        <RichTextEditor v-model="article.content" @input="handleContentChange" />
      </div>
  
      <!-- 发布设置弹窗 -->
      <el-dialog v-model="showPublishForm" title="发布文章" width="600px">
        <el-form :model="publishForm" label-width="80px">
          <el-form-item label="文章摘要">
            <el-input
              v-model="publishForm.summary"
              type="textarea"
              :rows="3"
              placeholder="请输入文章摘要（可选）"
            />
          </el-form-item>
          
          <el-form-item label="文章标签">
            <el-select
              v-model="publishForm.tags"
              multiple
              filterable
              allow-create
              placeholder="请选择或创建标签"
              style="width: 100%"
            >
              <el-option
                v-for="tag in availableTags"
                :key="tag"
                :label="tag"
                :value="tag"
              />
            </el-select>
          </el-form-item>
          
          <el-form-item label="分类">
            <el-select v-model="publishForm.category" placeholder="请选择分类">
              <el-option
                v-for="category in categories"
                :key="category.id"
                :label="category.name"
                :value="category.id"
              />
            </el-select>
          </el-form-item>
          
          <el-form-item label="封面图">
            <el-upload
              v-model:file-list="publishForm.cover"
              action="#"
              list-type="picture-card"
              :auto-upload="false"
              :limit="1"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
          </el-form-item>
        </el-form>
        
        <template #footer>
          <el-button @click="showPublishForm = false">取消</el-button>
          <el-button type="primary" @click="confirmPublish">确认发布</el-button>
        </template>
      </el-dialog>
    </div>
  </template>
  

  
  <style scoped lang="scss">
  .write-article {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    
    .article-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 20px;
      
      .title-input {
        flex: 1;
        
        :deep(.el-input__wrapper) {
          border: none;
          box-shadow: none;
          font-size: 24px;
          font-weight: 600;
          
          .el-input__inner {
            font-size: 24px;
            font-weight: 600;
            
            &::placeholder {
              color: #c0c4cc;
            }
          }
        }
      }
      
      .header-actions {
        display: flex;
        gap: 12px;
      }
    }
    
    .article-editor {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    }
  }
  </style>