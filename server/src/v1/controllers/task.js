const Task = require('../models/task');
const Section = require('../models/section');

// CREATE Task
exports.create = async (req, res) => {
  const { sectionId } = req.body;
  if (!sectionId) {
    return res.status(400).json({ message: 'Section ID is required' });
  }

  try {
    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    const tasksCount = await Task.find({ section: sectionId }).countDocuments();
    const task = await Task.create({
      section: sectionId,
      position: tasksCount > 0 ? tasksCount : 0
    });
    
    // Return the section in the response
    task._doc.section = section;
    return res.status(201).json(task);
  } catch (err) {
    console.error('Error in creating task:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

// UPDATE Task
exports.update = async (req, res) => {
  const { taskId } = req.params;
  if (!taskId) {
    return res.status(400).json({ message: 'Task ID is required' });
  }

  try {
    const task = await Task.findByIdAndUpdate(taskId, { $set: req.body }, { new: true });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.status(200).json(task);
  } catch (err) {
    console.error('Error in updating task:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

// DELETE Task
exports.delete = async (req, res) => {
  const { taskId } = req.params;
  if (!taskId) {
    return res.status(400).json({ message: 'Task ID is required' });
  }

  try {
    const currentTask = await Task.findById(taskId);
    if (!currentTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Task.deleteOne({ _id: taskId });

    // Re-order the positions of remaining tasks
    const tasks = await Task.find({ section: currentTask.section }).sort('position');
    for (let key in tasks) {
      await Task.findByIdAndUpdate(tasks[key]._id, { $set: { position: key } });
    }

    return res.status(200).json({ message: 'Task deleted' });
  } catch (err) {
    console.error('Error in deleting task:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

// UPDATE Task Position
exports.updatePosition = async (req, res) => {
  const {
    resourceList,
    destinationList,
    resourceSectionId,
    destinationSectionId
  } = req.body;

  if (!resourceSectionId || !destinationSectionId) {
    return res.status(400).json({ message: 'Section IDs are required' });
  }

  try {
    const resourceListReverse = resourceList.reverse();
    const destinationListReverse = destinationList.reverse();

    // Update the positions in the resource list
    if (resourceSectionId !== destinationSectionId) {
      for (let key in resourceListReverse) {
        await Task.findByIdAndUpdate(resourceListReverse[key].id, {
          $set: { section: resourceSectionId, position: key }
        });
      }
    }

    // Update the positions in the destination list
    for (let key in destinationListReverse) {
      await Task.findByIdAndUpdate(destinationListReverse[key].id, {
        $set: { section: destinationSectionId, position: key }
      });
    }

    return res.status(200).json({ message: 'Position updated' });
  } catch (err) {
    console.error('Error in updating task positions:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};
