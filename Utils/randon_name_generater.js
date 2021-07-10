export const getBlobName = (originalName) =>
    `${Math.random().toString().replace(/0\./, "")}-${originalName}`;

    export const createTextFileName = () =>
    `${Math.random().toString().replace(/0\./, "")}.txt`;