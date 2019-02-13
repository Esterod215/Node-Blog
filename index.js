// code away!
const express = require('express');
const server = express();
const dbUsers = require('./data/helpers/userDb');
const dbPosts = require('./data/helpers/postDb')
server.use(express.json());


function upperC(req,res,next){
    req.body.name = req.body.name.charAt(0).toUpperCase() +req.body.name.slice(1);
    next();
    
    
}

server.get('/api/users',(req,res)=>{
    dbUsers.get()
    .then(users=>{
        res.status(200).json({ success: true, users})
}).catch(err=>{
    res.status(500).json({success:false, message:err})
})
});

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

server.get('/api/users/:id', (req, res) => {
    const { id } = req.params;
    dbUsers
      .getById(id)
      .then(user => {
        if (user.length === 0) {
          res.status(404).json({success:false,message:'The user with the specified ID does not exist.'});
          return;
        }
        res.json(user);
      })
      .catch(error => {
        res.status(500).json({message:'The user information could not be retrieved.'});
      });
  });

  server.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    dbUsers
      .remove(id)
      .then(response => {
        if (response === 0) {
          res.status(404).json({message:'The user with the specified ID does not exist.'});
          return;
        }
        res.json({ success: true,message:`User with id: ${id} removed from system` });
      })
      .catch(error => {
        res.status(500).json({message:'The user could not be removed'});
        return;
      });
  });

  server.put('/api/users/:id',upperC, (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
      res.status(400).json({message:'Must provide name'});
      return;
    }
    dbUsers
      .update(id, { name })
      .then(response => {
        if (response == 0) {
            res.status(404).json({message:'The user with the specified ID does not exist.'});
          return;
        }
        dbUsers
          .getById(id)
          .then(user => {
            if (user.length === 0) {
              res.status(404).json({message:'User with that id not found'});
              return;
            }
            res.json(user);
          })
          .catch(error => {
            res.status(500).json({message:'Error looking up User'});
          });
      })
      .catch(error => {
        res.status(500).json({message:'The user information could not be modified.'});
        return;
      });
  });

  server.get('/api/users/posts/:user_id',(req,res)=>{
    const {user_id}=req.params
    dbUsers
    .getUserPosts(user_id)
    .then(userPosts=>{
        if(userPosts === 0){
            res.status(404).json({message:'No posts from that user'});
              return;
        }
        res.json(userPosts);
    })
    .catch(err=>{
        res.status(500).json({message:err})
        return
    });
  });







server.get('/api/posts',(req,res)=>{
    dbPosts.get()
    .then(posts=>{
        res.status(200).json({ success: true, posts})
}).catch(err=>{
    res.status(500).json({success:false, message:err})
})
});

server.post('/api/posts',(req,res)=>{
    const { text,user_id } = req.body;
     if(!text || !user_id) {
         res.status(400).json({message:"Please provide text and user_id for the post."})
         return;
     }
     
     dbPosts
     .insert({
         text,user_id
     })
     .then(response =>{
         res.status(201).json(response)
     }).catch(err=>{
         res.status(400).json({message: err})
         return;
     });
 });

 server.get('/api/posts/:id', (req, res) => {
    const { id } = req.params;
    dbPosts
      .getById(id)
      .then(post => {
        if (post.length === 0) {
          res.status(404).json({success:false,message:'The post with the specified ID does not exist.'});
          return;
        }
        res.json(post);
      })
      .catch(error => {
        res.status(500).json({message:'The post information could not be retrieved.'});
      });
  });

  server.delete('/api/posts/:id', (req, res) => {
    const { id } = req.params;
    dbPosts
      .remove(id)
      .then(response => {
        if (response === 0) {
          res.status(404).json({message:'The post with the specified ID does not exist.'});
          return;
        }
        res.json({ success: true,message:`Post with id: ${id} removed from system` });
      })
      .catch(error => {
        res.status(500).json({message:'The post could not be removed'});
        return;
      });
  });

  server.put('/api/posts/:id', (req, res) => {
    const { id } = req.params;
    const { text, user_id } = req.body;
    if (!text || !user_id) {
      res.status(400).json({message:'Must provide text and user_id'});
      return;
    }
    dbPosts
      .update(id, { text, user_id })
      .then(response => {
        if (response == 0) {
            res.status(404).json({message:'The post with the specified ID does not exist.'});
          return;
        }
        dbPosts
          .findById(id)
          .then(post => {
            if (post.length === 0) {
              res.status(404).json({message:'Post with that id not found'});
              return;
            }
            res.json(post);
          })
          .catch(error => {
            res.status(500).json({message:'Error looking up Post'});
          });
      })
      .catch(error => {
        res.status(500).json({message:error});
        return;
      });
  });
 




server.listen(5000, ()=>{
    console.log('listening on port 5000')
})
