export const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
];

export const dayNames = [
    "Min",
    "Sen",
    "Sel",
    "Rab",
    "Kam",
    "Jum",
    "Sab",
];

export const getCurrentMonth = () => {
    const today = new Date();

    return {
    month: today.getMonth(),
    year: today.getFullYear(),
    };
};

export const getDaysInMonth = (
    month,
    year
) => {
    return new Date(
    year,
    month + 1,
    0
    ).getDate();
};

export const getFirstDayOfMonth = (
    month,
    year
) => {
    return new Date(
    year,
    month,
    1
    ).getDay();
};