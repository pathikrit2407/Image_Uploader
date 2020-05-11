const express = require('express')
const multer = require('multer')
const path = require('path')
const ejs = require('ejs')

const app = express()

//EJS
app.set('view engine','ejs')

//Public directory
var publicpathdirectory = path.join(__dirname ,'/public' )

app.use(express.static(publicpathdirectory))

//multer storage engine
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)) //path... will give the original extension in the file
    }
  })

  var upload = multer({ 
      storage: storage ,
      limits:{fileSize:10000000},
      fileFilter:(req,file,cb)=>{
        //allowed extension
        const filetypes = /jpeg|jpg|png|gif/
        //check extension
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
        //check mimetype
        const mimetype = filetypes.test(file.mimetype)

        if(mimetype && extname){
            cb(null,true)
        }else{
            cb("Error: Image only !",false)
        }
      }
    }).single('myfile')

//==========Routes===============
app.get('/',(req,res)=>{
    res.render('main')
})

app.post('/uploads',(req,res)=>{
    upload(req, res, function (err) {
        if (err) {
         res.render('main',{
             msg:err
            }) 
        }else {
            if(req.file == undefined){
                res.render('main',{
                    msg:"Error: Select a image First",
                })
            }
            else{
                res.render('main',{
                    msg:"File Successfully Uploaded",
                    file: 'uploads/'+req.file.filename
                })
                console.log('uploads/'+req.file.filename)
            }
        }
      })
})
const port = process.env.PORT || 3000

app.listen(port,()=>{
    console.log("Server listening on "+port)
})