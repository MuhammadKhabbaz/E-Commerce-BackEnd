const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', (req, res) => {
  // find all categories
  // be sure to include its associated Products
  Category.findAll({
    include: [
      {
        model: Product,
      }
    ]
  })
  .then(categories => {
    res.json(categories); // Send the retrieved categories with their products as a JSON response
  })
  .catch(err => {
    console.error(err); // Log any errors
    res.status(500).json({ message: 'Error retrieving categories', error: err }); // Send an error response
  });
});

router.get('/:id', (req, res) => {
  // find one category by its `id` value
  Category.findByPk(req.params.id, {
    // be sure to include its associated Products
    include: [
      {
        model: Product,
      }
    ]
  })
  .then(categories => {
    res.json(categories); // Send the retrieved categories with their products as a JSON response
  })
  .catch(err => {
    console.error(err); // Log any errors
    res.status(500).json({ message: 'Error retrieving categories', error: err }); // Send an error response
  });
})
  

router.post('/', (req, res) => {
  // create a new category
  Category.create({
    category_name: req.body.category_name,
  })
  .then((newCategory) => {
    // Send the newly created row as a JSON object
    res.json(newCategory);
  })
  .catch((err) => {
    res.json(err);
  });
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
  Category.update(
    {
      category_name: req.body.category_name,
    },
    {
      where: {
        id: req.params.id,
      }
    }
  )
    .then((updtdCategory) => {
      // Send the updated row as a JSON object
      res.json(updtdCategory);
    })
    .catch((err) => {
      res.json(err);
    })
});

router.delete('/:id', (req, res) => {
  Category.destroy({
    where: {
      id:req.params.id,
    }
  })
  .then((deletedCategory) => {
    res.json(deletedCategory);
  })
  .catch((err) => res.json(err));
});

module.exports = router;
