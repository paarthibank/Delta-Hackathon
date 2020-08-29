var exp=require("express");
var mysql=require("mysql");
var bodyparser=require("body-parser");
var multer=require("multer");
con=exp();
con.use(bodyparser.json());
con.use(bodyparser.urlencoded({extended: true}));
con.use(exp.static("public"));

var sql=mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "Arizona"
})
sql.connect(function(err) {
  if (err) {
  	console.log(err);
  }
  console.log("Connected!");
});
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public')
  },
  filename: function (req, file, cb) {
     cb(null, file.originalname)
  }
})

var upload = multer({ storage: storage });
sql.query("CREATE DATABASE IF NOT EXISTS Hack");
sql.query("USE Hack");
sql.query("CREATE TABLE IF NOT EXISTS Heading(Name varchar(9) not null primary key,Tagline varchar(50) not null,Sizeh varchar(10) default 0,color varchar(30) default 0,logopos varchar(20) default 0,Heading varchar(50),Content varchar(1000),Logo varchar(50),Mainpic varchar(50),col1 varchar(50),col2 varchar(50),col3 varchar(50),Color1 varchar(30),size varchar(20))");



con.get("/",function(req,res){
	res.render("a.ejs");
	res.end();
})

con.post("/ajax",function(request,response){
	var a2=request.body;
	
	var name=[],rollno=[],dept=[];

	sql.query("INSERT INTO Heading(Name,Tagline,Sizeh,color,logopos) VALUES (?,?,?,?,?)",[a2.name,a2.tag,a2.font,a2.bg,a2.pos],function(err){
		if(err) throw err;
	});
	response.end();

})
con.post("/post",upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'home', maxCount: 1 }]),function(req,res){
	var n0=req.body.comp;
	var n1=req.body.content;
	var n2=req.body.header;
	var n3= req.body.color;

	var n4=req.body.col1;
	var n5=req.body.col2;
	var n6=req.body.col3;
	var n7=req.files['logo'][0].originalname;
	var n8=req.files['home'][0].originalname;
	var n9=req.body.size;

	console.log(n1,n2,n3,n4,n5,n6,n7,n8,n9,n0);
	console.log(n3);
	res.send("received");
	sql.query("UPDATE Heading SET Content = ?,Heading = ?,Color1 = ?,col1 = ?,col2 = ?,col3 = ?,Logo = ?,Mainpic = ?,size = ? WHERE Name = ?",[n1,n2,n3,n4,n5,n6,n7,n8,n9,n0],function(err){
		if(err) throw err;
		console.log("Update");

	})

})
con.get('/:name', function (req, response){
  var a=req.params.name;
  var obj;
  var tag,headsize,hcolor,logopos,head,content,logo,pic,col1,col2,col3,color,size; 
  sql.query("SELECT * FROM Heading WHERE Name = ?",a,function(err,res,fields){
  	if(err) throw err
  	headsize=res[0].Sizeh;
  	hcolor=res[0].color;
  	logopos=res[0].logopos;
  	tag=res[0].Tagline;
  	head=res[0].Heading;
  	content=res[0].Content;
  	logo=res[0].Logo;
  	pic=res[0].Mainpic;
  	col1=res[0].col1;
  	col2=res[0].col2;
  	col3=res[0].col3;
  	colorr=res[0].Color1;
  	size=res[0].size;
  	obj={
  		name:a,
	  	tag,headsize,hcolor,logopos,head,content,logo,pic,col1,col2,col3,colorr,size
	  }
  	response.render("b.ejs",obj);
  	console.log(obj);
  	response.end();
  	});



  })
con.get('/:name/edit', function (req, res){
	var a=req.params.name;
	var ob={
		a
	}
	res.render("c.ejs",ob);
	res.end();
  


  })
con.post("/ost",function(req,res){
	var n0=req.body.comp;
	if(req.body.content=undefined){
		var n1=req.body.content;	
		sql.query("UPDATE Heading SET Content = ? WHERE Name = ? ",[n0,n1]);
	}
	if(req.body.header=undefined){
		var n1=req.body.header;	
		sql.query("UPDATE Heading SET Heading = ? WHERE Name = ? ",[n0,n1]);
	}
	if(req.body.tag=undefined){
		var n1=req.body.tag;	
		sql.query("UPDATE Heading SET Tagline = ? WHERE Name = ? ",[n0,n1]);
	}
	res.send("updated");
	res.end();

})
 
  
 
 
con.listen(3000)