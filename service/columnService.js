import { ColumnModel } from "../models/ColumnModel.js";
import { BoardModel } from "../models/BoardModel.js";
import { APIError } from "../exceptions/APIError.js";

class ColumnService {
    async add(title, boardId, userCompany) {
        if (userCompany.role !== "ADMIN" && userCompany.role !== "MANAGER") {
            throw APIError.BadRequest("Нет прав на добавление");
        }

        const maxPositionColumn = await ColumnModel.findOne({ boardId })
            .sort({ position: -1 })
            .exec();

        const newPosition = maxPositionColumn
            ? maxPositionColumn.position + 1
            : 1;

        const column = ColumnModel.create({
            title,
            boardId,
            position: newPosition,
        });

        return column;
    }

    async edit(title, columnId, boardId, userCompany) {
        if (userCompany.role !== "ADMIN" && userCompany.role !== "MANAGER") {
            throw APIError.BadRequest("Нет прав на редактирование");
        }

        const edittedColumn = await ColumnModel.findByIdAndUpdate(
            columnId,
            { title },
            {
                new: true,
            },
        );

        return edittedColumn;
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

export const columnService = new ColumnService();
