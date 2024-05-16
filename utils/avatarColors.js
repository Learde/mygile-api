const colors = [
    "#219ebc",
    "#03045e",
    "#fb5607",
    "#8338ec",
    "#d62828",
    "#f77f00",
    "#fcbf49",
    "#457b9d",
    "#d5bdaf",
    "#ff8fab",
    "#e07a5f",
    "#3d405b",
    "#81b29a",
    "#ef476f",
    "#06d6a0",
    "#118ab2",
    "#0081a7",
    "#386641",
    "#7678ed",
    "#006d77",
    "#f28482",
    "#84a59d",
    "#007200",
    "#168aad",
    "#ff595e",
    "#003566",
    "#ffc300",
    "#0fa3b1",
    "#f3de2c",
    "#ffd670",
];

export const getRandomAvatarColor = function () {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
};
