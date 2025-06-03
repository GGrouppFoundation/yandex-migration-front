export const downloadFile = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
};

export const extractFilename = (response, defaultName) => {
    const contentDisposition = response.headers.get('content-disposition');
    if (!contentDisposition) return null;

    const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
    return filenameMatch?.[1] || defaultName;
};

export const validateZipFile = (file) => {
    return file && (
        file.name.endsWith('.ytexp') ||
        file.type === 'application/zip' ||
        file.type === 'application/x-zip-compressed'
    );
};