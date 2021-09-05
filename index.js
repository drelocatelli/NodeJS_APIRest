const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require("jsonwebtoken");
const e = require('express');

const JWTSecret = "ndsifhsoiahapshdspajdoasfjpskaspfjasp";

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

function auth(req, res, next){

    const authToken = req.headers["authorization"];

    if(authToken != undefined){

        const bearer = authToken.split(' ');
        var token = bearer[1];

        jwt.verify(token, JWTSecret, (err, data) => {
            if(err){
                res.status(401);
                res.json({error: "Token não existente."})
            }else{
                res.status(200);
                req.token = token;
                req.loggedUser = {id: data.id, email: data.email};
                // tudo certo
                next();

            }
        });
        
    }else{
        res.status(401);
        res.json({error: "Não autorizado, token inválido."})
    }
    
}

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
    ],
    users: [
        {
            id: 1,
            name: "Victor",
            email: "victordevtb@guiadoprogramador.com.br",
            password: "nodejs<3"
        },
        {
            id: 2,
            name: "Guilherme",
            email: "guigg@gmail.com",
            password: "java123"
        }
    ]
    
}

app.get("/", (req, res) =>{
    res.send("Olá gamers!");
})

app.post("/auth", (req, res) => {

    var {email, password} = req.body;

    if(email != undefined){

        let user = DB.users.find(user => user.email == email);

        if(user != undefined){

            if(user.password == password){

                jwt.sign({id: user.id, email: user.email}, JWTSecret, {expiresIn: '48h'}, (err, token) =>{
                    if(err){
                        res.status(400);
                        res.json({error: "Falha interna."})
                    }else{
                        res.status(200);
                        res.json({token: token});
                    }
                });
           
            }
            
        }else{
            res.status(404);
            res.json({error: "Usuário não existe."})
        }

    }else{
        res.status(403);
        res.json({error: "O e-mail é inválido"});
    }
    
})

app.get("/games", auth, (req, res) => {
    res.status(200);
    res.setHeader("Content-Type", "application/json");
    res.json(DB.games);
})

app.get("/game/:find", auth, (req, res) => {
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