const Factory = require("../dao/factory");
const getDataUser = async(userId)=>{
    try {
        const data = Factory.models("user").getById(userId);
        return data;
    } catch (error) {
        throw error;
    }
}
module.exports = {
    getDataUser
}