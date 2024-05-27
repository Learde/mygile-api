import { ColumnModel } from "../models/ColumnModel.js";
import { TaskModel } from "../models/TaskModel.js";
import { BoardModel } from "../models/BoardModel.js";
import { UserModel } from "../models/UserModel.js";
import { APIError } from "../exceptions/APIError.js";
import { chatService } from "./chatService.js";

class TaskService {
    async add(taskData, columnId, boardId, user) {
        const column = await ColumnModel.findById(columnId);
        if (!column) {
            throw APIError.NotFound("Колонка не найдена");
        }

        const board = await BoardModel.findById(boardId);
        if (!board) {
            throw APIError.NotFound("Доска не найдена");
        }

        const maxPositionTask = await TaskModel.findOne({ columnId })
            .sort({ position: -1 })
            .exec();

        const newPosition = maxPositionTask ? maxPositionTask.position + 1 : 1;

        const maxNumberTask = await TaskModel.findOne({ boardId })
            .sort({ number: -1 })
            .exec();

        const newNumber = maxNumberTask ? maxNumberTask.number + 1 : 1;

        const chat = await chatService.add({ title: taskData.title });

        const task = await TaskModel.create({
            ...taskData,
            columnId,
            boardId,
            authorId: user._id ?? user.id,
            chatId: chat._id,
            position: newPosition,
            number: newNumber,
        });

        return task;
    }

    async get(taskId) {
        const task = await TaskModel.findById(taskId);

        const author = await UserModel.findById(task.authorId).select(
            "-password -activationLink",
        );

        return {
            ...task.toObject(),
            author,
        };
    }

    async edit(taskData, taskId, userCompany, user) {
        const task = await TaskModel.findById(taskId);
        if (!task) {
            throw APIError.BadRequest("Задача не найдена");
        }

        const isMember = task.members.some(
            (memberId) => memberId.toString() === user.id.toString(),
        );
        const isAuthor = task.authorId.toString() === user.id.toString();
        if (userCompany.role !== "ADMIN" && userCompany.role !== "MANAGER" && !isMember && !isAuthor) {
            throw APIError.BadRequest("Нет прав на редактирование");
        }

        const editedTask = await TaskModel.findByIdAndUpdate(
            taskId,
            taskData,
            {
                new: true,
            },
        );

        return editedTask;
    }

    async moveTask(taskId, newPosition, newColumnId) {
        const task = await TaskModel.findById(taskId);
        if (!task) {
            throw APIError.BadRequest("Задача не найдена");
        }

        const oldColumnId = task.columnId;
        const isSameColumn = oldColumnId.toString() === newColumnId.toString();

        if (!isSameColumn) {
            const tasksInOldColumn = await TaskModel.find({
                columnId: oldColumnId,
                _id: { $ne: taskId },
            }).sort({ position: 1 });

            for (let i = 0; i < tasksInOldColumn.length; i++) {
                tasksInOldColumn[i].position = i + 1;
                await tasksInOldColumn[i].save();
            }
        }

        const tasksInNewColumn = await TaskModel.find({
            columnId: newColumnId,
            _id: { $ne: taskId },
        }).sort({ position: 1 });
        for (let i = 0; i < tasksInNewColumn.length; i++) {
            if (i + 1 >= newPosition) {
                tasksInNewColumn[i].position = i + 2;
            } else {
                tasksInNewColumn[i].position = i + 1;
            }
            await tasksInNewColumn[i].save();
        }

        task.columnId = newColumnId;
        task.position = newPosition;
        await task.save();

        return task;
    }

    async delete(columnId, userCompany) {
        if (userCompany.role !== "ADMIN" && userCompany.role !== "MANAGER") {
            throw APIError.BadRequest("Нет прав на удаление");
        }

        const deletedColumn = await ColumnModel.findByIdAndDelete(columnId);

        await ColumnModel.updateMany(
            {
                boardId: deletedColumn.boardId,
                position: { $gt: deletedColumn.position },
            },
            { $inc: { position: -1 } },
        );

        return deletedColumn;
    }

    async moveColumn(columnId, newPosition, userCompany) {
        if (userCompany.role !== "ADMIN" && userCompany.role !== "MANAGER") {
            throw APIError.BadRequest("Нет прав на изменение позиции");
        }

        const column = await ColumnModel.findById(columnId);
        if (!column) {
            throw APIError.NotFound("Колонка не найдена");
        }

        const currentPosition = column.position;
        const boardId = column.boardId;

        if (newPosition > currentPosition) {
            // Сдвигаем колонки вниз
            await ColumnModel.updateMany(
                {
                    boardId: boardId,
                    position: { $gt: currentPosition, $lte: newPosition },
                },
                { $inc: { position: -1 } },
            );
        } else if (newPosition < currentPosition) {
            // Сдвигаем колонки вверх
            await ColumnModel.updateMany(
                {
                    boardId: boardId,
                    position: { $gte: newPosition, $lt: currentPosition },
                },
                { $inc: { position: 1 } },
            );
        }

        // Обновляем позицию перемещаемой колонки
        column.position = newPosition;
        await column.save();

        return column;
    }
}

export const taskService = new TaskService();
