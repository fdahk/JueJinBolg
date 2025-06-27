// 加载环境变量（必须在最前面）
// import dotenv from 'dotenv' // 暂时不使用，这个包都没下载，环境变量也没配置，先本地用着
// dotenv.config()

import Redis from 'ioredis'

// Redis 连接配置
const redisConfig = {
  // 基础连接配置
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || '',
  db: parseInt(process.env.REDIS_DB) || 0,
  
  // 连接超时配置
  connectTimeout: 10000,        // 连接超时10秒
  commandTimeout: 5000,         // 命令超时5秒
  
  // 重试配置
  retryDelayOnFailover: 100,    // 故障转移重试延迟
  maxRetriesPerRequest: 3,      // 每个请求最大重试次数
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000)
    return delay
  },
  
  // 连接池配置
  lazyConnect: true,            // 延迟连接
  keepAlive: 30000,            // 保持连接30秒
  enableOfflineQueue: false,    // 离线时不排队命令
  
  // 键名前缀（可选）
  keyPrefix: process.env.NODE_ENV === 'development' ? 'dev:' : 'prod:',
}

// 创建Redis实例
const redis = new Redis(redisConfig)

// 连接事件监听
redis.on('connect', () => {
  console.log(`✅ Redis 连接成功: ${redisConfig.host}:${redisConfig.port}`)
  console.log(`📦 使用数据库: ${redisConfig.db}`)
  console.log(`🏷️  键名前缀: ${redisConfig.keyPrefix || '无'}`)
})

redis.on('ready', () => {
  console.log('🚀 Redis 已就绪，可以执行命令')
})

redis.on('error', (err) => {
  console.error('❌ Redis 连接失败:', err.message)
})

redis.on('close', () => {
  console.log('🔌 Redis 连接已关闭')
})

redis.on('reconnecting', (ms) => {
  console.log(`🔄 Redis 正在重连... (${ms}ms后重试)`)
})

// 优雅关闭
process.on('SIGINT', async () => {
  console.log('\n🛑 正在关闭Redis连接...')
  await redis.quit()
  process.exit(0)
})

export default redis