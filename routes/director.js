const mongoose=require('mongoose');
const express = require('express');
const router = express.Router();

//models
const Director = require('../models/Director');

//add new director
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

//get all directors
router.get('/', (req, res, next) => {
    Director.find({})
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.json(err);
        });
});

//get directors with movies
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