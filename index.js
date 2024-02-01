import express from "express";
import bodyParser from "body-parser";
import fs from 'fs'

const app = express();
const port = 3000;

var dic = {};
//dic['name'] = ['the', 'kdi'];
var content = {};

var authname = {};

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res)=>{
    //console.log(dic);
    res.render('index.ejs', {'data':dic});
});

app.get('/new', (req, res)=>{
    res.render('new.ejs');
})

app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
});


app.post('/blog', (req, res)=>{
    //res.render('blog.ejs');
    var value = req.body;
    //console.log(req.body['paragraph_text']);
    if (value['author'] in dic){
        dic[value['author']].push(value['title']);
    }
    else{
    dic[value['author']] = [];
    dic[value['author']].push(value['title']);
     }
     content[value['title']] = value['paragraph_text'];
     authname[value['title']] = value['author'];
    //content[value['title']] = value['paragraph_text'];
    var result = `<%- include('header.ejs')%>`+`<h1 class='head'>${value['title']}</h1>` +`<p class='body'>Author : ${value['author']} </p>` + `<p class='body'>${value['paragraph_text']}</p>`+`<form action="/change" class="body" method="post"><input type="submit" name="${value['title']}" class="btn btn-dark extra" value='Edit'><input type="submit" name="${value['title']}" class="btn btn-dark extra" value='Delete'></form>`+`<%- include('footer.ejs')%>`;
    fs.writeFile(`views\\${value['title']}.ejs`, result, 'utf8', function (err) {
        if (err) return console.log(err);
     });

     setTimeout(() => {
        res.render(`${value['title']}.ejs`);
      }, "1000");
     
})

app.post('/change', (req,res)=>{
    //console.log(Object.keys(req.body)[0]);
    //console.log(content[Object.keys(req.body)[0]]);
    var n = req.body[Object.keys(req.body)[0]];
    if (n== 'Edit'){
    res.render('new.ejs', {'author':authname[Object.keys(req.body)[0]],
    'title': Object.keys(req.body)[0],
    'body': content[Object.keys(req.body)[0]]});

    }
    else{
        //console.log(authname[Object.keys(req.body)[0]]);
        var list = dic[authname[Object.keys(req.body)[0]]];
        //console.log(list);
        const index = list.indexOf(Object.keys(req.body)[0]);
        const x = list.splice(index, 1);
        //dic[authname[Object.keys(req.body)[0]]].remove(Object.keys(req.body)[0]);
        //console.log(req.body);
        //console.log(list);
        //console.log(dic);
        //console.log(authname);
        if (list.length == 0){
            const key = authname[Object.keys(req.body)[0]];
            delete(dic[key]);
            //console.log(key);
            //console.log(dic);
        }

        var name  = Object.keys(req.body)[0];
        fs.unlink(`views//${name}.ejs`, (err) => {
            if (err) {
              console.error(err);
            } else {
              console.log('File is deleted.');
            }
          });

        res.render('index.ejs', {'data':dic});
        //delete content[Object.keys(req.body)[0]];
        //delete authname[Object.keys(req.body)[0]];


    }
})

app.post('/open', (req,res)=>{
    //console.log(req.body);
    var file = req.body[Object.keys(req.body)[0]];
    res.render(`${file}.ejs`);
    //console.log(req.body[Object.keys(req.body)[0]]);
    
})



