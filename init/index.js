
const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing.js");


const MONO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("db is connected");
}).catch((err)=>{
    console.log(`connection Fail because ${err}`);
})


async function main(){
    await mongoose.connect(MONO_URL);
}

const initDB = async()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({
        ...obj,
        owner: "68fd271437c6e77fe5d27fe0"
    }))
    await Listing.insertMany(initData.data);
    console.log('data was inislised');
};

initDB();