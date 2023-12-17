const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  // find all tags
  Tag.findAll({
    include: [
      {
        model: Product,
      }
    ]
  })
  .then(tags => {
    res.json(tags); // Send the retrieved tags with their products as a JSON response
  })
  .catch(err => {
    console.error(err); // Log any errors
    res.status(500).json({ message: 'Error retrieving tags', error: err }); // Send an error response
  });
  // be sure to include its associated Product data
});

router.get('/:id', (req, res) => {
  // find a single tag by its `id`
  Tag.findByPk(req.params.id, {
    include: [
      {
        model: Product,
      }
    ]
  })
  .then(tags => {
    res.json(tags); // Send the retrieved tags with their products as a JSON response
  })
  .catch(err => {
    console.error(err); // Log any errors
    res.status(500).json({ message: 'Error retrieving tags', error: err }); // Send an error response
  });
  // be sure to include its associated Product data
});

router.post('/', (req, res) => {
  // create a new tag
  Tag.create({
    tag_name:req.body.tag_name,
  })
  .then((newTag) => {
    // Send the newly created row as a JSON object
    res.json(newTag);
  })
  .catch((err) => {
    res.json(err);
  });
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  Tag.update(
    {
      tag_name: req.body.tag_name,
    },
    {
      where: {
        id: req.params.id,
      }
    }
  )
  .then((updtdTag) => {
    // Send the updated row as a JSON object
    res.json(updtdTag);
  })
  .catch((err) => {
    res.json(err);
  })
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
  Tag.destroy({
    where: {
      id:req.params.id,
    }
  })
  .then((deletedTag) => {
    res.json(deletedTag);
  })
  .catch((err) => res.json(err));
});

module.exports = router;
