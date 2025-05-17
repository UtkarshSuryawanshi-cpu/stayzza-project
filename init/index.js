const mongoose = require("mongoose");

// Accessing data from Listing Model from data.js of init folder
const initialisedData = require("./data.js");

// Accessing Listing model from listing.js file
const Listing = require("../models/listing.js");


async function main(){
      await mongoose.connect('mongodb://127.0.0.1:27017/dromomania');
}
main()
.then((res)=>{
    console.log(result);
})
.catch((err)=>{
    console.log(err);
})




const initDB = async ()=>{
    // await Listing.insertMany(initialisedData.data);
    await Listing.deleteMany({});

     initialisedData.data = initialisedData.data.map((obj)=>({...obj, owner:'6826007e8e0719640bf34bb4'}))
    
    console.log(initialisedData)
    await Listing.insertMany(initialisedData.data);
    console.log("data initialised");
};

initDB();

