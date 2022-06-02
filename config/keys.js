// 我的密码存放在NODE-APP文件夹下的.env中
// PASSWORD=xxxx
require('dotenv').config('../env')
const { PASSWORD } = process.env
module.exports={
    PASSWORD:PASSWORD,
    mongoURI:`mongodb+srv://sicilly:${PASSWORD}@cluster0.zemlich.mongodb.net/?retryWrites=true&w=majority`
}