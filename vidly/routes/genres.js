const express = require('express');
const router = express.Router();
const {Genre, validate} = require('../models/genre');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');


//Route = "api/genres"

router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);
})

router.get('/:id', async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    
    if(!genre) {
        return res.status(404).send("Could not find genre with that id");
    }
    
    return res.send(genre);
})

router.put('/:id', async (req, res) => {
    // Validate 
    // If invalid return 400 = Bad request
    const {error} = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);      
    }

    const genre = Genre.findByIdAndUpdate(req.params.id, {
        name: req.body.name
    }, {new: true});

    if(!genre) {
        return res.status(404).send('The course with the given id was not found');
    }

    res.send(genre);
})

router.post('/',auth ,async (req, res) => {

    let {error} = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    let genre = new Genre({
        name: req.body.name
    })

    genre = await genre.save();
    res.send(genre);
})

router.delete('/:id', [auth, admin], async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    
    if (!genre) {
        return res.status(404).send("Could not find genre with that id");
    }
    res.send(genre);
})
module.exports = router;