const { catchAsyncError } = require("../middlewares/auth.middleware");
const posts = require("../models/posts");

const createPosts = catchAsyncError(async (request, response, next) => {
    try {
        const {title, body, reactions, tags} = request.body;
        
    } catch (error) {
        
    }
})