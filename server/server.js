require("dotenv").config();

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.urlencoded({express:true}));

const API_KEY = process.env.API_KEY;

function fetchNews(url, res){
  axios.get(url).then(response => {
    if(response.data.totalResult > 0){
      res.json({
        status:200,
        success : true,
        message: "Successfully fetch the data",
        data : response.data
      });
    } else{
      res.json({
        status:200,
        success : true,
        message: "No more results to show",
      });
    }
  })

  .catch(error => {
    res.json({
      status:500,
      success : false,
      message: "Failed to fetch data from the API",
      error:error.message
    });
  }); 
  
}

//all news

app.get("/all-news", (req,res) => {
  let pageSize = parseInt(req.query.pageSize) || 80;
  let page = parseInt(req.query.page) || 1;

  let url = `https://newsapi.org/v2/everything?q=language=en&page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`

  fetchNews(url,res);
});

//top-headlines
app.options("/top-headlines",cors());

app.get("/top-headlines",(req , res) => {
  let pageSize = parseInt(req.query.pageSize) || 80;
  let page = parseInt(req.query.page) || 1;
  let category = req.query.category || "business" ; 

  let url = `https://newsapi.org/v2/top-headlines?category=${category}&language=en&page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`;
  fetchNews(url,res);

})

//country

app.options("/country/:iso",cors());
app.get("/country/:iso",(req, res) => {
  let pageSize = parseInt(req.query.pageSize) || 80;
  let page = parseInt(req.query.page) || 1;
  const country = req.params.iso;

  let url = `https://newsapi.org/v2/top-headlines/sources?country=${country}&apiKey=${API_KEY}&pageSize=${pageSize}&page=${page}`;
  fetchNews(url,res)
})

//port
const PORT = process.env.PORT || 3000;

app.listen(PORT , ()=> {
  console.log(`server is running at port ${PORT}`);
});