const express = require('express');
const router = express.Router();

const Movie = require('../models/Movie');

/**
* @swagger
* /api/movies:
*   post:
*     tags:
*       - movies
*     name: Add movie
*     summary: add new movie 
*     consumes:
*       - application/json
*     parameters:
*       - name: Movie
*         in: body
*         schema:     
*           type: object
*           properties:
*             title:
*               type: string
*             imdb_score:
*               type: int
*             category:
*               type: string
*             year:
*               type: Date
*             director_id:
*               type: string
*         required:
*           - title
*     responses:
*       200:
*         description: adding new movie is successfull
*       400:
*         description: bad request
*       
*/
router.post('/', (req, res, next) => {
  const { title, imdb_score, category, country, year, director_id } = req.body;

  const movie = new Movie({
    title: title,
    imdb_score: imdb_score,
    category: category,
    country: country,
    year: year,
    director_id: director_id
  });

  movie.save()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });

  // movie.save((err, data) => {
  //   if (err)
  //     res.json(err)
  //   res.send(data);
  // });
});

//get top 5 movies
router.get('/top/:limit', (req, res) => {
  const { limit } = req.params;
  Movie.find({}, 'imdb_score title country year').limit(parseInt(limit)).sort({ imdb_score: -1 })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });
});

/**
* @swagger
* /api/movies:
*   get:
*     tags:
*       - movies
*     name: get all movies
*     summary: returns all movies
*     consumes:
*       - application/json
*     parameters:
*       - name: x-access-token
*         in: header
*         required:
*           - x-access-token
*     responses:
*       200:
*         description: return all movies with successfully
*       401:
*         description: Unauthorized
*/
router.get('/', (req, res) => {
  Movie.aggregate([
    {
      $lookup: {
        from: 'directors',
        localField: 'director_id',
        foreignField: '_id',
        as: 'director'
      }
    },
    {
      $unwind: {
        path: '$director',
        preserveNullAndEmptyArrays: true
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

//get movie by id
router.get('/:movie_id', (req, res, next) => {
  Movie.findById(req.params.movie_id)
    .then((data) => {
      if (!data) {
        next({ 'message': 'The movie was not found', 'code': 99 });
        return
      }
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });
});

//update movie by id
router.put('/:movie_id', (req, res, next) => {
  Movie.findByIdAndUpdate(
    req.params.movie_id,
    req.body,
    {
      new: true //güncellenen data gösterilir
    })
    .then((data) => {
      if (!data) {
        next({ 'message': 'The movie was not found', 'code': 99 });
        return
      }
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });
});

//delete movie by id
router.delete('/:movie_id', (req, res, next) => {
  Movie.findByIdAndDelete(req.params.movie_id)
    .then((data) => {
      if (!data) {
        next({ 'message': 'The movie was not found', 'code': 99 });
        return;
      }
      res.json({status:1});
    })
    .catch((err) => {
      res.json(err);
    });
});

//between years
router.get('/between/:start_year/:end_year', (req, res) => {
  const { start_year, end_year } = req.params;
  Movie.find(
    {
      year: { "$gte": parseInt(start_year), "$lte": parseInt(end_year) }
    }, 'title country year')
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });
});

module.exports = router;
