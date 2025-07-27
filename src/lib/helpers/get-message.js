export const getErrorMessage = (error) => {
    if (typeof error === 'object' && error !== null) {
        return (
            error?.response?.data?.message ||
            error?.message ||
            error?.response?.message ||
            'An unknown error occurred'
        );
    }
    return 'An unknown error occurred';
};

export const getSuccessMessage = (res) => {
    return res?.data?.message || res?.message || 'Success';
};
