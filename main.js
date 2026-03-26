console.log("A");

setTimeout(() => console.log("B"), 0);

console.log("C");

setTimeout(() => console.log("D"), 100);

console.log("E");

// What order will these print?
// A, C, E, B, D


// Build: Create a function that simulates loading user data
function loadUser(userId, callback) {
    // Simulate 1.5 second database lookup
    setTimeout(() => {
        const user = {
            id: userId,
            name: "Denzel Anyiko",
            email: "denzel.anyiko@example.com"
        };

    //  Call callback with user object
    callback(user);
    }, 1500);

}

// Use the loadUser function
loadUser(1, (user) => {
    console.log("User data loaded:");
    console.log(user);
});



// Promises
function getUserData(userId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (userId > 0) {
                resolve({ id: userId, name: "John" });
            } else {
                reject("Invalid user ID");
            }
        }, 1000);
    });
}

// getUserPosts and getPostComments
function getUserPosts(userId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (userId > 0) {
                resolve([{ id: 1, userId, title: "Post 1" }, { id: 2, userId, title: "Post 2" }]);
            } else {
                reject("Invalid user ID");
            }
        }, 1000);
    });
}

function getPostComments(postId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (postId > 0) {
                resolve([{ id: 1, postId, text: "Comment 1" }, { id: 2, postId, text: "Comment 2" }]);
            } else {
                reject("Invalid post ID");
            }
        }, 1000);
    });
}

// Build: Fetch data for 3 users simultaneously and display them all at once.

Promise.all([getUserData(1), getUserData(2), getUserData(3)])
    .then(users => {
        console.log("All user data loaded:");
        console.log(users);
    })
    .catch(error => {
        console.error("Error loading user data:");
        console.error(error);
    });



    // Callback Hell
function getUserData(userId, callback) {
    setTimeout(() => {
        callback({ id: userId, name: "John" });
    }, 1000);
}

function getUserPosts(userId, callback) {
    setTimeout(() => {
        callback([
            { id: 1, title: "Post 1" },
            { id: 2, title: "Post 2" }
        ]);
    }, 1000);
}

function getPostComments(postId, callback) {
    setTimeout(() => {
        callback([
            { id: 1, text: "Great post!" },
            { id: 2, text: "Thanks for sharing" }
        ]);
    }, 1000);
}

// The nightmare:
getUserData(1, function(user) {
    console.log("User:", user);
    getUserPosts(user.id, function(posts) {
        console.log("Posts:", posts);
        getPostComments(posts[0].id, function(comments) {
            console.log("Comments:", comments);
            // Imagine 3 more levels deep...
        });
    });
});
    // Build: Rewrite the callback hell example using async/await
async function fetchUserData(userId) {
    try {
        const user = await getUserData(userId);
        console.log("User:", user);
        const posts = await getUserPosts(user.id);
        console.log("Posts:", posts);
        const comments = await getPostComments(posts[0].id);
        console.log("Comments:", comments);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

