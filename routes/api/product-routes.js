const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', (req, res) => {
  // find all products
  Product.findAll({
    include: [
      {
        model: Category,
      },
      {
        model: Tag,
        through: ProductTag
      }
    ]
  })
  .then(products => {
    res.json(products); // Send the retrieved products with their category as a JSON response
  })
  .catch(err => {
    console.error(err); // Log any errors
    res.status(500).json({ message: 'Error retrieving products', error: err }); // Send an error response
  });
  // be sure to include its associated Category and Tag data
});

// get one product
router.get('/:id', (req, res) => {
  // find a single product by its `id`
  Product.findByPk(req.params.id, {
    include: [
      {
        model: Category,
      },
      {
        model: Tag,
        through: ProductTag
      }
    ]
  })
  .then(products => {
    res.json(products); // Send the retrieved products with their category as a JSON response
  })
  .catch(err => {
    console.error(err); // Log any errors
    res.status(500).json({ message: 'Error retrieving products', error: err }); // Send an error response
  });
  // be sure to include its associated Category and Tag data
});

// create new product
router.post('/', (req, res) => {
  // Create a new product
  Product.create({
    product_name: req.body.product_name,
    price: req.body.price,
    stock: req.body.stock
  })
  .then((product) => {
    // If there are product tags, create pairings to bulk create in the ProductTag model
    if (req.body.tagIds && req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id
        };
      });
      return ProductTag.bulkCreate(productTagIdArr).then(() => product);
    }
    // If no product tags, just respond
    return product;
  })
  .then((product) => {
    // Send the product as a JSON response
    res.status(200).json(product);
  })
  .catch((err) => {
    console.error(err);
    res.status(400).json({ message: 'Error creating new product', error: err });
  });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        
        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
          .filter((tag_id) => !productTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              product_id: req.params.id,
              tag_id,
            };
          });

            // figure out which ones to remove
          const productTagsToRemove = productTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);
                  // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', (req, res) => {
  // delete one product by its `id` value
  Product.destroy({
    where: {
      id: req.params.id,
    }
  })
  .then((deletedCategory) => {
    res.json(deletedCategory);
  })
  .catch((err) => res.json(err));
});

module.exports = router;