const express = require('express');
const dotenv =require('dotenv');
dotenv.config();
const app = express();
let cors = require('cors')
const mongoose=require('mongoose');
const mySecret = process.env.Mongo_url;
	const movieRoute=require('./Route/Movies');
const RowRoute=require('./Route/Rows');
const tvShowRoute=require('./Route/TvShows');
const AuthRoute=require('./Route/auth');
const UserRoute=require('./Route/Users');
const AnimeRoute=require('./Route/Animes');
const DownloadVideo=require('./Route/Download');
app.use(cors())
mongoose.set('strictQuery', false);
mongoose.connect(mySecret,								 
{ useNewUrlParser: true, useUnifiedTopology: true,

})
.then(() => console.log('connected to DB!'))
.catch(error => console.log(error));
app.use(function (req, res, next) {

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});
app.use(express.json());
app.use("/movie",movieRoute);
app.use("/list",RowRoute);
app.use("/tvShow",tvShowRoute);
app.use("/auth", AuthRoute);
app.use("/auth", UserRoute);
app.use("/anime",AnimeRoute);
app.use("/download",DownloadVideo);
app.listen(4000, () => {
  console.log('Backend server is running');
}, { functionInvocationTimeout: 3600000 }); // set function invocation timeout to 1 hour (3600 seconds x 1000 milliseconds)

