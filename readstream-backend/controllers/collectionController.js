import Collection from '../models/Collection.js';

// @desc    Get user collections
// @route   GET /api/collections
// @access  Private
export const getCollections = async (req, res) => {
  try {
    const collections = await Collection.find({ user: req.user._id })
      .populate('contents')
      .sort({ updatedAt: -1 });

    res.json(collections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new collection
// @route   POST /api/collections
// @access  Private
export const createCollection = async (req, res) => {
  try {
    const { name, description, contents = [] } = req.body;

    const collection = await Collection.create({
      user: req.user._id,
      name,
      description,
      contents
    });

    const populatedCollection = await Collection.findById(collection._id).populate('contents');

    res.status(201).json(populatedCollection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update collection
// @route   PUT /api/collections/:id
// @access  Private
export const updateCollection = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    if (collection.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { name, description, contents } = req.body;

    if (name) collection.name = name;
    if (description !== undefined) collection.description = description;
    if (contents) collection.contents = contents;

    await collection.save();

    const updatedCollection = await Collection.findById(collection._id).populate('contents');

    res.json(updatedCollection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete collection
// @route   DELETE /api/collections/:id
// @access  Private
export const deleteCollection = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    if (collection.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await collection.deleteOne();

    res.json({ message: 'Collection deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
