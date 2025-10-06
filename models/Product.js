import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide product description']
  },
  price: {
    type: Number,
    required: [true, 'Please provide product price'],
    min: 0
  },
  imageUrl: {
    type: String,
    required: [true, 'Please provide image URL']
  },
  category: {
    type: String,
    required: [true, 'Please provide category'],
    enum: ['Men', 'Women', 'Kids']
  },
  sizes: [{
    type: String,
    enum: ['S', 'M', 'L', 'XL']
  }],
  stock: {
    type: Number,
    default: 100,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for search
productSchema.index({ name: 'text', description: 'text' });

// Use default export
export default mongoose.model('Product', productSchema);
