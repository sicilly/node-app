## express搭建服务器

Node-app文件夹下安装express：

```shell
PS E:\FE\projects\node-demo\node-app> npm install express
```

新建server.js

```javascript
const express =require("express");

const app=express();

// 路由
app.get("/",(req,res)=>{
    res.send("Hello world!")
})

const port = process.env.PORT || 5000;

app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
})
```

安装nodemon，可以在保存的时候自动重新启动服务器：

```bash
PS E:\FE\projects\node-demo\node-app> npm install nodemon -g
PS E:\FE\projects\node-demo\node-app> nodemon server.js
[nodemon] 2.0.16
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node server.js`
Server running on port 5000
```

再修改一下package.json

```json
{
  "name": "app",
  "version": "1.0.0",
  "description": "restful api",
  "main": "server.js",
  "scripts": {
    "start":"node server.js",
    "server":"nodemon server.js"
  },
  "author": "sicilly",
  "license": "ISC",
  "dependencies": {
    "express": "^4.18.1"
  }
}

```

这样npm run start的时候就是用node server.js

开发环境下npm run server就是用nodemon server.js

此时访问浏览器：

![image-20220602100832281](https://picture-1308610694.cos.ap-nanjing.myqcloud.com/202206021008322.png)

## 连接数据库

https://www.mongodb.com/atlas/database 注册并创建一个免费的数据库

具体方法参考这里：https://blog.csdn.net/weixin_44519083/article/details/119610881

![image-20220602104211988](https://picture-1308610694.cos.ap-nanjing.myqcloud.com/202206021042045.png)

回到终端安装mongoose：

```
PS E:\FE\projects\node-demo\node-app> npm install mongoose
```

server.js中引入mongoose，连接数据库

```js
const express =require("express");
const mongoose = require("mongoose");
const app=express();

// db config
const db=require("./config/keys").mongoURI

// connect to mongodb
mongoose.connect(db)
        .then(()=>console.log("MongoDB Connected"))
        .catch((err=>console.log(err)));

// 路由
app.get("/",(req,res)=>{
    res.send("Hello world!")
})

const port = process.env.PORT || 5000;

app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
})
```

安装了dotenv用来管理env

```
npm i dotenv --save 
```

NODE-APP下创建.env

```
PASSWORD=xxxxxxxxxx
```

新建一个config/keys.js存放mongoURI：

```js
require('dotenv').config('../env')
const { PASSWORD } = process.env
module.exports={
    PASSWORD:PASSWORD,
    mongoURI:`mongodb+srv://sicilly:${PASSWORD}@cluster0.zemlich.mongodb.net/?retryWrites=true&w=majority`
}
```

终端显示连上了数据库：

```
[nodemon] starting `node server.js`
Server running on port 5000
MongoDB Connected
```

## 搭建路由和数据模型

routes\api\users.js

```js
// @login & register
const express = require("express");
const router = express.Router();

// $route GET api/users/test
// @desc 返回的请求的json数据
// @access public
router.get("/test",(req,res)=>{
    res.json({msg:"login"})
});

module.exports=router;
```

在server.js中引入和使用users

```js
// 引入users.js
const users=require("./routes/api/users")

// 使用routes
app.use("/api/users",users);
```

在浏览器中访问：

![image-20220602132155808](https://picture-1308610694.cos.ap-nanjing.myqcloud.com/202206021321867.png)

接下来开始创建模型，新建models/users.js

```js
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    avatar:{
        type:String
    },
    date:{
        type:String,
        default:Date.now
    }
})

module.exports=User=mongoose.model("users",UserSchema);
```

## 搭建注册接口并存储数据

安装postman，测试一下刚才的test接口

![image-20220602140830697](https://picture-1308610694.cos.ap-nanjing.myqcloud.com/202206021408744.png)

安装body-parser和bcrypt(用于对密码进行加密)

```bash
PS E:\FE\projects\node-demo\node-app> npm install body-parser
PS E:\FE\projects\node-demo\node-app> npm install bcrypt
```

在server.js中引入并使用body-parser

```js
const bodyParser=require("body-parser")

// 使用body-parser中间件
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
```

user.js先引入User，写register接口

```js
const User = require("../../models/User");

// $route POST api/users/register
// @desc 返回的请求的json数据
// @access public
router.post("/register",(req,res)=>{
    // console.log(req.body);
    // 查询数据库中是否有这个邮箱
    User.findOne({email:req.body.email})
        .then((user)=>{
            if(user){
                return res.status(400).json({email:"邮箱已被注册!"});
            }else{
                const newUser = new User({
                    name:req.body.name,
                    email:req.body.email,
                    password:req.body.password
                })

                bcrypt.genSalt(10,function(err,salt){
                    bcrypt.hash(newUser.password,salt,(err,hash)=>{
                        if(err) throw err;
                        newUser.password=hash;
                        newUser.save()
                                .then(user=>res.json(user))
                                .catch(err=>console.log(err));
                    })
                })
            }
        })

});
```

在postman中测试，成功返回：

![image-20220602165538083](https://picture-1308610694.cos.ap-nanjing.myqcloud.com/202206021655120.png)

云数据库中也有了这条数据：

![image-20220602165839563](https://picture-1308610694.cos.ap-nanjing.myqcloud.com/202206021658617.png)
