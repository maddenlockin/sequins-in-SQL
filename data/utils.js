function getCategoryIdByName(categories, name) {
    const matchedCategory = categories.find(category => {
        console.log(category);
        return category.category === name;
    });
    return matchedCategory.id;
}

module.exports = {
    getCategoryIdByName: getCategoryIdByName
};