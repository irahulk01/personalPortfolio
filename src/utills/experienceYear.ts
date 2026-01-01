const careerStartDate = new Date("2021-12-01");
const now = new Date();

const diffInMonths = (now.getFullYear() - careerStartDate.getFullYear()) * 12 + (now.getMonth() - careerStartDate.getMonth());

const years = Math.floor(diffInMonths / 12);
const months = diffInMonths % 12;

export default { years, months };