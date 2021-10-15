const mongoose =require("mongoose")
// const mongooseURI="mongodb://localhost:27017/Inotebook?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false"
const mongooseURI="mongodb+srv://Sahil:sncs12@cluster0.rqzwy.mongodb.net/Inotebook?retryWrites=true&w=majority"


const conectToMongo= ()=>{
    mongoose.connect(mongooseURI,()=>{
        console.log("connected to mongo successfuly")
    })
}

module.exports= conectToMongo;


// {
//     useNewUrlParser:true,
//     useCreateIndex:true,
//     useUnifiedTopology:true,
//     useFindAndModify:false

// },