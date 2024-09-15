const Section = require('../models/section')
const Task = require('../models/task')

// Create Section
exports.create = async (req, res) => {
  const { boardId } = req.params
  try {
    const section = await Section.create({ board: boardId })
    section._doc.tasks = []
    res.status(201).json(section)
  } catch (err) {
    console.error(err) // Log the error for debugging
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
}

// Update Section
exports.update = async (req, res) => {
  const { sectionId } = req.params
  try {
    const section = await Section.findByIdAndUpdate(
      sectionId,
      { $set: req.body },
      { new: true } // Return the updated section
    )
    if (!section) {
      return res.status(404).json({ message: 'Section not found' })
    }
    section._doc.tasks = []
    res.status(200).json(section)
  } catch (err) {
    console.error(err) // Log the error for debugging
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
}

// Delete Section
exports.delete = async (req, res) => {
  const { sectionId } = req.params
  try {
    const section = await Section.findById(sectionId)
    if (!section) {
      return res.status(404).json({ message: 'Section not found' })
    }

    await Task.deleteMany({ section: sectionId })
    await Section.deleteOne({ _id: sectionId })

    res.status(200).json({ message: 'Section deleted successfully' })
  } catch (err) {
    console.error(err) // Log the error for debugging
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
}
