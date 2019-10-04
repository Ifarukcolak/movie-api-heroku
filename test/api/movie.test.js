const chai = require('chai');
const chai_http = require('chai-http');
const should = chai.should();
const server = require('../../app');

chai.use(chai_http);

let token, movieID;

describe('/api/movies', () => {
    before((done) => {
        chai.request(server)
            .post('/authenticate')
            .send({ username: 'testt', password: 'testt' })
            .end((err, res) => {
                if (err)
                    throw err;
                console.log('Response :',res.body.token);
                token = res.body.token;
                done();
            });
    });

    describe('/GET all movies', () => {
        it('it should GET all movies', (done) => {
            chai.request(server)
                .get('/api/movies')
                .set("x-access-token", token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        })
    });

    describe('/POST add movie', () => {
        it('it should POST a movie to the db', (done) => {
            const movie = {
                title: 'udemy',
                director_id: '5d833a510ebc39385946d696',
                category: 'fear',
                country: 'Turkey',
                year: 1970,
                imdb_score: 8
            };

            chai.request(server)
                .post('/api/movies')
                .send(movie)
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('title');
                    res.body.should.have.property('director_id');
                    res.body.should.have.property('category');
                    res.body.should.have.property('country');
                    res.body.should.have.property('year');
                    res.body.should.have.property('imdb_score');
                    movieID = res.body._id;
                    done();
                });
        })
    });

    describe('/GET/:movie_id movie', () => {
        it('it should GET a movie by the given id', (done) => {
            chai.request(server)
                .get('/api/movies/' + movieID)
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('title');
                    res.body.should.have.property('director_id');
                    res.body.should.have.property('category');
                    res.body.should.have.property('country');
                    res.body.should.have.property('year');
                    res.body.should.have.property('imdb_score');
                    res.body.should.have.property('_id').eql(movieID);
                    done();
                });
        });
    });

    describe('/PUT/:movie_id', () => {
        it('it should UPDATE a movie according to the given id', (done) => {
            const movie = {
                title: 'udemyPut',
                director_id: '5d833a510ebc39385946d696',
                category: 'fear',
                country: 'Germany',
                year: 1970,
                imdb_score: 9
            };

            chai.request(server)
                .put('/api/movies/' + movieID)
                .send(movie)
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('title').eql(movie.title);
                    res.body.should.have.property('director_id').eql(movie.director_id);
                    res.body.should.have.property('category').eql(movie.category);
                    res.body.should.have.property('country').eql(movie.country);
                    res.body.should.have.property('year').eql(movie.year);
                    res.body.should.have.property('imdb_score').eql(movie.imdb_score);

                    done();
                });
        })
    });

    describe('/DELETE/:movie_id', () => {
        it('it should DELETE a movie according to the given id', (done) => {
            chai.request(server)
                .delete('/api/movies/' + movieID)
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');

                    done();
                });
        })
    });
});