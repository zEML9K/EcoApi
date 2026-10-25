export function handleError(res, error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
        return res.status(400).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: 'Помилка сервера' });
}