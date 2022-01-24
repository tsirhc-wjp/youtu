// 创建一个新的axios实例/对象
// 设置基地址和超时时长
const http = axios.create({
  baseURL: 'http://82.156.8.100:9001/api/v1',
  timeout: 10000
})


const httpV2 = axios.create({
  baseURL: 'http://82.156.8.100:9001/api/v2',
  timeout: 10000
})