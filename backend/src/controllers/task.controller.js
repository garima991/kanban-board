import { Task } from "../models/task.model.js";
import { Board } from "../models/board.model.js";

/**
 * @desc create a new task
 * @route POST /api/v1/tasks
 * @access Private (Authenticated ones)
 */

export const createTask = async (req, res) => {
  try {
    const { boardId } = req.params;
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const { title, dueDate, description, status, priority, tags, color } =
      req.body;
    const taskAdmin = req.user._id;

    if (!title ) {
      return res
        .status(400)
        .json({ msg: "All the details are required" });
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      status,
      tags,
      boardId,
      color,
      taskAdmin,
      assignedTo: [taskAdmin],
    });

    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create task", error: error.message });
  }
};


/**
 * @desc Get all tasks for a board
 * @route GET /boards/:boardId/tasks
 * @access Private (Board members)
 */

export const getTasksByBoard = async (req, res) => {
  try {
    const boardId = req.params.boardId;
    const tasks = await Task.find({ boardId });

    res.status(200).json({ message: "Tasks fetched successfully", tasks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/**
 * @desc Get a specific task by ID
 * @route GET /boards/:boardId/tasks/:taskId
 * @access Private (Board members)
 */

export const getTaskById = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task fetched successfully", task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/**
 * @desc Update a task (only assigned members can update)
 * @route PATCH /boards/:boardId/tasks/:taskId
 * @access Private (Assigned users only)
 */

export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const updates = req.body;

    const task = await Task.findByIdAndUpdate(taskId, updates, { new: true });
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update task", error: error.message });
  }
};


/**
 * @desc Delete a task
 * @route DELETE /boards/:boardId/tasks/:taskId
 * @access Private (Only task admin)
 */

export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findByIdAndDelete(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete task", error: error.message });
  }
};


/**
 * @desc Add a subtask
 * @route POST /boards/:boardId/tasks/:taskId/subtasks
 * @access Private (Board admin / task admin / assigned user)
 */

export const addSubtask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title } = req.body;

    if (!title)
      return res.status(400).json({ message: "Subtask title is required" });

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.subtasks.push({ title, isCompleted: false });
    await task.save();

    res.status(201).json({ message: "Subtask added successfully", task });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add subtask", error: error.message });
  }
};


/**
 * @desc delete a subtask from a task
 * @route DELETE /api/v1/:boardId/tasks/:taskId/subtask/:subtaskId
 * @access Private (Task members only)
 */

export const deleteSubtask = async (req, res) => {
  try {
    const { taskId, subtaskId } = req.params;
    const task = await Task.findById(taskId);

    if (!task) return res.status(404).json({ message: "Task not found" });

    task.subtasks = task.subtasks.filter(
      (st) => st._id.toString() !== subtaskId
    );
    await task.save();

    res.status(200).json({ message: "Subtask deleted successfully", task });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete subtask", error: error.message });
  }
};


/**
 * @desc update a subtask
 * @route PATCH /api/v1/:boardId/tasks/:taskId/subtask/:subtaskId
 * @access Private (Task members only)
 */

export const updateSubtask = async (req, res) => {
  try {
    const { taskId, subtaskId } = req.params;
    const { title, isCompleted } = req.body;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const subtask = task.subtasks.id(subtaskId);
    if (!subtask) return res.status(404).json({ message: "Subtask not found" });

    if (title !== undefined) subtask.title = title;
    if (isCompleted !== undefined) subtask.isCompleted = isCompleted;

    await task.save();

    res.status(200).json({ message: "Subtask updated successfully", task });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update subtask", error: error.message });
  }
};


/**
 * @desc assign a user to a task
 * @route POST /api/v1/:boardId/tasks/:taskId/assign
 * @access Private (Task or Board admin only)
 */

export const assignTask = async (req, res) => {
  try {
    const { boardId, taskId } = req.params;

    const { userId } = req.body;
    if (!userId)
      return res.status(400).json({ message: "User ID is required" });

    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ message: "Board not found" });

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (!task.assignedTo.includes(userId)) {
      task.assignedTo.push(userId);
      await task.save();
    }

    res.status(200).json({ message: "User assigned successfully", task });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to assign user", error: error.message });
  }
};


/**
 * @desc remove a member from a task
 * @route DELETE /api/v1/:boardId/tasks/:taskId/assign/:userId
 * @access Private (Task or Board admin only)
 */

export const removeTaskMember = async (req, res) => {
  try {
    const { taskId, userId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.assignedTo = task.assignedTo.filter((id) => id.toString() !== userId);
    await task.save();

    res.status(200).json({ message: "User removed from task", task });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to remove user", error: error.message });
  }
};


/**
 * @desc change task status (e.g. ToDo → InProgress)
 * @route PATCH /api/v1/:boardId/tasks/:taskId/status
 * @access Private (Task members only)
 */

export const changeTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    if (!status) return res.status(400).json({ message: "Status is required" });

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.status = status;
    await task.save();

    res.status(200).json({ message: "Task status updated", task });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update status", error: error.message });
  }
};
