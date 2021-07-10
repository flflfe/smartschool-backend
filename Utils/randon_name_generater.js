const getBlobName = (originalName) =>
    `${Math.random().toString().replace(/0\./, "")}-${originalName}`;

exports = getBlobName