import Product from '../models/Product.js';

// @desc    Get all products with search, filter, and pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const { search, category, size, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) query.category = category;
    if (size) query.sizes = size;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(query)
      .limit(limitNum)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ success: false, message: 'Product not found' });

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Seed demo products (for development)
// @route   POST /api/products/seed
// @access  Public
export const seedProducts = async (req, res) => {
  try {
    await Product.deleteMany({});

    const demoProducts = [
      {
        name: 'Classic Cotton T-Shirt',
        description: 'Comfortable cotton t-shirt perfect for everyday wear',
        price: 29.99,
        imageUrl: 'https://via.placeholder.com/400x400?text=T-Shirt',
        category: 'Men',
        sizes: ['S', 'M', 'L', 'XL'],
        stock: 100
      },
      {
        name: 'Slim Fit Jeans',
        description: 'Modern slim fit jeans with stretch comfort',
        price: 79.99,
        imageUrl: 'https://via.placeholder.com/400x400?text=Jeans',
        category: 'Men',
        sizes: ['S', 'M', 'L', 'XL'],
        stock: 75
      },
      {
        name: 'Leather Jacket',
        description: 'Premium leather jacket with classic design',
        price: 299.99,
        imageUrl: 'https://via.placeholder.com/400x400?text=Jacket',
        category: 'Men',
        sizes: ['M', 'L', 'XL'],
        stock: 30
      },
      {
        name: 'Summer Dress',
        description: 'Light and breezy summer dress',
        price: 89.99,
        imageUrl: 'https://via.placeholder.com/400x400?text=Dress',
        category: 'Women',
        sizes: ['S', 'M', 'L', 'XL'],
        stock: 60
      },
      {
        name: 'Casual Hoodie',
        description: 'Cozy hoodie for casual outings',
        price: 59.99,
        imageUrl: 'https://via.placeholder.com/400x400?text=Hoodie',
        category: 'Women',
        sizes: ['S', 'M', 'L', 'XL'],
        stock: 90
      },
      {
        name: 'Kids T-Shirt Pack',
        description: 'Pack of 3 colorful t-shirts for kids',
        price: 39.99,
        imageUrl: 'https://via.placeholder.com/400x400?text=Kids+Tshirt',
        category: 'Kids',
        sizes: ['S', 'M', 'L'],
        stock: 120
      },
      {
        name: 'Kids Denim Shorts',
        description: 'Comfortable denim shorts for active kids',
        price: 34.99,
        imageUrl: 'https://via.placeholder.com/400x400?text=Kids+Shorts',
        category: 'Kids',
        sizes: ['S', 'M', 'L'],
        stock: 80
      },
      {
        name: 'Wool Sweater',
        description: 'Warm wool sweater for cold days',
        price: 119.99,
        imageUrl: 'https://via.placeholder.com/400x400?text=Sweater',
        category: 'Men',
        sizes: ['M', 'L', 'XL'],
        stock: 45
      },
      {
        name: 'Yoga Pants',
        description: 'Flexible yoga pants for workout',
        price: 49.99,
        imageUrl: 'https://via.placeholder.com/400x400?text=Yoga+Pants',
        category: 'Women',
        sizes: ['S', 'M', 'L', 'XL'],
        stock: 110
      },
      {
        name: 'Formal Blazer',
        description: 'Professional blazer for office wear',
        price: 199.99,
        imageUrl: 'https://via.placeholder.com/400x400?text=Blazer',
        category: 'Women',
        sizes: ['S', 'M', 'L', 'XL'],
        stock: 40
      },
      {
        name: 'Sport Jacket',
        description: 'Lightweight jacket for sports activities',
        price: 89.99,
        imageUrl: 'https://via.placeholder.com/400x400?text=Sport+Jacket',
        category: 'Men',
        sizes: ['S', 'M', 'L', 'XL'],
        stock: 65
      },
      {
        name: 'Cargo Pants',
        description: 'Utility cargo pants with multiple pockets',
        price: 69.99,
        imageUrl: 'https://via.placeholder.com/400x400?text=Cargo+Pants',
        category: 'Men',
        sizes: ['M', 'L', 'XL'],
        stock: 55
      },
      {
        name: 'Floral Blouse',
        description: 'Elegant floral print blouse',
        price: 54.99,
        imageUrl: 'https://via.placeholder.com/400x400?text=Blouse',
        category: 'Women',
        sizes: ['S', 'M', 'L'],
        stock: 70
      },
      {
        name: 'Kids Hoodie',
        description: 'Warm and cozy hoodie for kids',
        price: 44.99,
        imageUrl: 'https://via.placeholder.com/400x400?text=Kids+Hoodie',
        category: 'Kids',
        sizes: ['S', 'M', 'L'],
        stock: 95
      },
      {
        name: 'Maxi Dress',
        description: 'Elegant maxi dress for special occasions',
        price: 139.99,
        imageUrl: 'https://via.placeholder.com/400x400?text=Maxi+Dress',
        category: 'Women',
        sizes: ['S', 'M', 'L', 'XL'],
        stock: 35
      },
      {
        name: 'Running Shorts',
        description: 'Breathable shorts for running',
        price: 39.99,
        imageUrl: 'https://via.placeholder.com/400x400?text=Running+Shorts',
        category: 'Men',
        sizes: ['S', 'M', 'L', 'XL'],
        stock: 100
      },
      {
        name: 'Kids Dress',
        description: 'Pretty dress for special occasions',
        price: 59.99,
        imageUrl: 'https://via.placeholder.com/400x400?text=Kids+Dress',
        category: 'Kids',
        sizes: ['S', 'M', 'L'],
        stock: 50
      },
      {
        name: 'Polo Shirt',
        description: 'Classic polo shirt for casual wear',
        price: 44.99,
        imageUrl: 'https://via.placeholder.com/400x400?text=Polo+Shirt',
        category: 'Men',
        sizes: ['S', 'M', 'L', 'XL'],
        stock: 85
      },
      {
        name: 'Cardigan',
        description: 'Soft cardigan for layering',
        price: 64.99,
        imageUrl: 'https://via.placeholder.com/400x400?text=Cardigan',
        category: 'Women',
        sizes: ['S', 'M', 'L', 'XL'],
        stock: 60
      },
      {
        name: 'Kids Jeans',
        description: 'Durable jeans for everyday wear',
        price: 49.99,
        imageUrl: 'https://via.placeholder.com/400x400?text=Kids+Jeans',
        category: 'Kids',
        sizes: ['S', 'M', 'L'],
        stock: 75
      }
    ];

    const products = await Product.insertMany(demoProducts);

    res.status(201).json({
      success: true,
      message: `${products.length} demo products created successfully`,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
