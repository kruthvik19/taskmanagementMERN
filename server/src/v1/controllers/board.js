const Board = require('../models/board');
const Section = require('../models/section');
const Task = require('../models/task');
const mongoose = require('mongoose');

exports.create = async (req, res) => {
  try {
    const boardsCount = await Board.countDocuments();
    const board = await Board.create({
      user: req.user._id,
      position: boardsCount > 0 ? boardsCount : 0
    });
    res.status(201).json(board);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAll = async (req, res) => {
  try {
    const boards = await Board.find({ user: req.user._id }).sort('-position');
    res.status(200).json(boards);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updatePosition = async (req, res) => {
  const { boards } = req.body;
  try {
    await Promise.all(
      boards.reverse().map(async (board, index) => {
        await Board.findByIdAndUpdate(board.id, { $set: { position: index } });
      })
    );
    res.status(200).json('updated');
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getOne = async (req, res) => {
  const { boardId } = req.params;
  try {
    const board = await Board.findOne({ user: req.user._id, _id: boardId });
    if (!board) return res.status(404).json({ message: 'Board not found' });

    const sections = await Section.find({ board: boardId });
    for (const section of sections) {
      const tasks = await Task.find({ section: section.id }).populate('section').sort('-position');
      section._doc.tasks = tasks;  // Dynamically attach tasks to the section object
    }

    board._doc.sections = sections;
    res.status(200).json(board);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.update = async (req, res) => {
  const { boardId } = req.params;
  const { title, description, favourite } = req.body;

  try {
    const currentBoard = await Board.findById(boardId);
    if (!currentBoard) return res.status(404).json({ message: 'Board not found' });

    // Handle favourites logic here
    if (favourite !== undefined && currentBoard.favourite !== favourite) {
      const favourites = await Board.find({
        user: currentBoard.user,
        favourite: true,
        _id: { $ne: boardId }
      }).sort('favouritePosition');

      if (favourite) {
        req.body.favouritePosition = favourites.length > 0 ? favourites.length : 0;
      } else {
        for (const [index, element] of favourites.entries()) {
          await Board.findByIdAndUpdate(element.id, { $set: { favouritePosition: index } });
        }
      }
    }

    const updatedBoard = await Board.findByIdAndUpdate(boardId, { $set: req.body }, { new: true });
    res.status(200).json(updatedBoard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getFavourites = async (req, res) => {
  try {
    const favourites = await Board.find({ user: req.user._id, favourite: true }).sort('-favouritePosition');
    res.status(200).json(favourites);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateFavouritePosition = async (req, res) => {
  const { boards } = req.body;
  try {
    await Promise.all(
      boards.reverse().map(async (board, index) => {
        await Board.findByIdAndUpdate(board.id, { $set: { favouritePosition: index } });
      })
    );
    res.status(200).json('updated');
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.delete = async (req, res) => {
  const { boardId } = req.params;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const currentBoard = await Board.findById(boardId);
    if (!currentBoard) return res.status(404).json({ message: 'Board not found' });

    // Delete all sections and tasks related to the board
    await Section.deleteMany({ board: boardId });
    await Task.deleteMany({ section: { $in: currentBoard.sections } });

    if (currentBoard.favourite) {
      const favourites = await Board.find({
        user: currentBoard.user,
        favourite: true,
        _id: { $ne: boardId }
      }).sort('favouritePosition');

      for (const [index, element] of favourites.entries()) {
        await Board.findByIdAndUpdate(element.id, { $set: { favouritePosition: index } });
      }
    }

    await Board.deleteOne({ _id: boardId });
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: 'Board deleted successfully' });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
