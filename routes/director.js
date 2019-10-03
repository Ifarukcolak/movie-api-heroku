const mongoose=require('mongoose');
const express = require('express');
const router = express.Router();

//models
const Director = require('../models/Director');

/**
* @swagger
* /api/directors:
*   post:
*     tags:
*       - director
*     name: Add
*     summary: add a new director
*     consumes:
*       - application/json
*     parameters:
*       - name: Director
*         in: body
*         schema:     
*           type: object
*           properties:
*             name:
*               type: string
*             surname:
*               type: string
*             bio :
*               type: string
*             createdAt:
*               type : Date
*         required:
*           - name
*           - surname
*       - name : x-access-token
*         in : header
*         required:
*           - token
*     responses:
*       200:
*         description: adding new director is successfull
*       401:
*         description: Unauthorized
*       
*/
router.post('/', (req, res, next) => {
    const director = new Director(req.body);

    director.save()
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.json(err);
        });
});

/**
* @swagger
* /api/directors:
*   get:
*     tags:
*       - director
*     name: get directors
*     summary: returns all directors
*     consumes:
*       - application/json
*     parameters:
*       - name: x-access-token
*         in: header
*         required:
*           - x-access-token
*     responses:
*       200:
*         description: return all directors with successfully
*       401:
*         description: Unauthorized
*/
router.get('/', (req, res, next) => {
    Director.find({})
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.json(err);
        });
});

/**
* @swagger
* /api/directors/withMovies:
*   get:
*     tags:
*       - director
*     name: get directors with movies
*     summary: returns all directors with movies
*     consumes:
*       - application/json
*     parameters:
*       - name: x-access-token
*         in: header
*         required:
*           - x-access-token
*     responses:
*       200:
*         description: return all directors with successfully
*       401:
*         description: Unauthorized
*/
router.get('/withMovies', (req, res, next) => {
    Director.aggregate(
        [
            {
                $lookup: {
                    from: 'movies', //collection name
                    localField: '_id',
                    foreignField: 'director_id',
                    as: 'movies'
                }
            },
            {
                $unwind: {
                    path: '$movies',
                    preserveNullAndEmptyArrays:true //join işlemi sonucunda filmi olmayan director'leri de getir
                }
            },
            {
                $group:{
                    _id:{
                        _id:'$id',
                        name:'$name',
                        surname:'$surname',
                        bio:'$bio'
                    },
                    movies:{
                        $push:'$movies'
                    }
                }
            },
            {
                $project:{
                    _id:'$_id._id',
                    name:'$_id.name',
                    surname:'$_id.surname',
                    movies:'$movies'
                }
            }
        ])
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.json(err);
        });
});

//get director by id
router.get('/withMovies/:director_id', (req, res, next) => {
    Director.aggregate(
        [
            {
                $match:{
                    '_id':mongoose.Types.ObjectId(req.params.director_id)
                }
            },
            {
                $lookup: {
                    from: 'movies', //collection name
                    localField: '_id',
                    foreignField: 'director_id',
                    as: 'movies'
                }
            },
            {
                $unwind: {
                    path: '$movies',
                    preserveNullAndEmptyArrays:true //join işlemi sonucunda filmi olmayan director'leri de getir
                }
            },
            {
                $group:{
                    _id:{
                        _id:'$id',
                        name:'$name',
                        surname:'$surname',
                        bio:'$bio'
                    },
                    movies:{
                        $push:'$movies'
                    }
                }
            },
            {
                $project:{
                    _id:'$_id._id',
                    name:'$_id.name',
                    surname:'$_id.surname',
                    movies:'$movies'
                }
            }
        ])
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.json(err);
        });
});

//update director by id
router.put('/:director_id', (req, res, next) => {
    Director.findByIdAndUpdate(
      req.params.director_id,
      req.body,
      {
        new: true //güncellenen data gösterilir
      })
      .then((data) => {
        if (!data) {
          next({ 'message': 'The director was not found', 'code': 99 });
          return
        }
        res.json(data);
      })
      .catch((err) => {
        res.json(err);
      });
  });

  //delete director by id
  router.delete('/:director_id',(req,res,next)=>{
      Director.findByIdAndDelete(req.params.director_id)
        .then((data)=>{
            if (!data) {
                next({ 'message': 'The director was not found', 'code': 99 });
                return
              }
              res.json(data);
        })
        .catch((err)=>{
            res.json(err);
        });
  })



module.exports = router;