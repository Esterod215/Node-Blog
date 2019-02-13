// code away!
const express = require('express');
const server = express();
const dbUsers = require('./data/helpers/userDb');
const dbPosts = require('./data/helpers/postDb')
server.use(express.json());


server.get('/api/users',(req,res)=>{
    dbUsers.get()
    .then(users=>{
        res.status(200).json({ success: true, users})
}).catch(err=>{
    res.status(500).json({success:false, message:err})
})
});

server.get('/api/posts',(req,res)=>{
    dbPosts.get()
    .then(posts=>{
        res.status(200).json({ success: true, posts})
}).catch(err=>{
    res.status(500).json({success:false, message:err})
})
});

function upperC(req,res,next){
    
        req.body.name = req.body.name.charAt(0).toUpperCase() +req.body.name.slice(1);
        next();
    
    
}

server.post('/api/users',upperC,(req,res)=>{
    const { name } = req.body;
    if(!name) {
        res.status(400).json({message:"Please provide a name for the post."})
        return;
    }
    
    dbUsers
    .insert({
        name
    })
    .then(response =>{
        res.status(201).json(response)
    }).catch(err=>{
        res.status(400).json({message: err})
        return;
    });
});



server.listen(5000, ()=>{
    console.log('listening on port 5000')
})
