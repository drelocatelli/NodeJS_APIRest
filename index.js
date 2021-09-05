const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var DB = {

    games: [
        {
            id:23,
            title: 'Call of duty MW',
            year: 2019,
            price: 60
        },
        {
            id:65,
            title: 'Sea of thieves',
            year: 2018,
            price: 40
        },
        {
            id:2,
            title: 'Minecraft',
            year: 2019,
            price: 30
        }
    ]
    
}

app.get("/", (req, res) =>{
    res.send("Olá gamers!");
})

app.get("/games", (req, res) => {
    res.status(200);
    res.setHeader("Content-Type", "application/json");
    res.json(DB.games);
})

app.get("/game/:find", (req, res) => {
    res.setHeader("Content-Type", "application/json");

    let find = req.params.find;


    if(isNaN(req.params.find)){

        let game = DB.games.find(game => game.title == find);
        if(game != undefined){
            res.status(200);
            res.json(game);
        }else{
            res.sendStatus(400);
        }
        

    }else{
        find = parseInt(find);
        let game = DB.games.find(game => game.id == find);

        if(game != undefined){
            res.status(200);
            res.json(game);
        }else{
            res.sendStatus(404);
        }
    }

    
})


let port = 80;
app.listen(port, () =>{
    console.log("API RODANDO NA PORTA "+port);
})