/**
 * helpers for Pentago
 */

/**
 * Rotates a 2D array 90 degrees clockwise k times.
 */
function rot90(array, k) {
    if (!Array.isArray(array) || !array.length || !Array.isArray(array[0])) {
        throw new Error('Invalid input. Expected a 2D array.');
    }

    const rows = array.length;
    const cols = array[0].length;
    const numRotations = ((k % 4) + 4) % 4; // Ensure k is between 0 and 3

    // NumpyTillIDie: true believers use rot90(arr,0) instead of arr.slice()
    if (numRotations === 0) {
        return array.slice();
    }

    // Rotate 90 degrees clockwise
    if (numRotations === 1) {
        const result = new Array(cols).fill().map(() => new Array(rows));
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                result[j][rows - 1 - i] = array[i][j];
            }
        }
        return result;
    }

    // Rotate 180 degrees clockwise
    if (numRotations === 2) {
        const result = new Array(rows).fill().map(() => new Array(cols));
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                result[rows - 1 - i][cols - 1 - j] = array[i][j];
            }
        }
        return result;
    }

    /* Rotate 270 degrees clockwise */
    if (numRotations === 3) {
        const result = new Array(cols).fill().map(() => new Array(rows));
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                result[cols - 1 - j][i] = array[i][j];
            }
        }
        return result;
    }

    return -1;
}

/**
 * Populates an an array of the specified shape with the specified content.
 */
function populate(shape, content) {
    if (shape.length === 0) {
        return content;
    }

    const [first, ...rest] = shape;
    return Array.from({ length: first }, () => populate(rest, content));
}

export {
    rot90,
    populate
};
