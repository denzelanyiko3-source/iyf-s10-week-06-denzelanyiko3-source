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


fetchUserData(1);


// DOM Elements

const userInput = document.getElementById("user-id");
const getUserBtn = document.getElementById("get-user");
const getUsersBtn = document.getElementById("get-users");
const getPostsBtn = document.getElementById("get-posts");
const output = document.getElementById("output");


// Reusable Fetch Function

async function fetchData(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    console.error(error);
    output.innerHTML = "<p>Error fetching data</p>";
  }
}

// Get Single User

getUserBtn.addEventListener("click", async () => {
  const id = userInput.value;

  if (!id) {
    output.innerHTML = "<p>Please enter a user ID</p>";
    return;
  }

  const user = await fetchData(
    `https://jsonplaceholder.typicode.com/users/${id}`
  );

  if (!user) return;

  output.innerHTML = `
    <h2>${user.name}</h2>
    <p><strong>Email:</strong> ${user.email}</p>
    <p><strong>City:</strong> ${user.address.city}</p>
  `;
});

// Get All Users

getUsersBtn.addEventListener("click", async () => {
  const users = await fetchData(
    "https://jsonplaceholder.typicode.com/users"
  );

  if (!users) return;

  let html = "<h2>All Users</h2>";

  users.forEach(user => {
    html += `
      <div style="margin-bottom:10px;">
        <strong>${user.name}</strong><br>
        ${user.email}
      </div>
    `;
  });

  output.innerHTML = html;
});


// Get Posts for User 1

getPostsBtn.addEventListener("click", async () => {
  const posts = await fetchData(
    "https://jsonplaceholder.typicode.com/users/1/posts"
  );

  if (!posts) return;

  let html = "<h2>User 1 Posts</h2>";

  posts.forEach(post => {
    html += `
      <div style="margin-bottom:15px;">
        <h4>${post.title}</h4>
        <p>${post.body}</p>
      </div>
    `;
  });

  output.innerHTML = html;
});







const loading = document.getElementById("loading");
const errorDiv = document.getElementById("error");
const container = document.getElementById("users-container");

async function loadUsers() {
    try {
        showLoading();
        
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        
        if (!response.ok) {
            throw new Error("Failed to fetch users");
        }
        
        const users = await response.json();
        displayUsers(users);
        
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

function showLoading() {
    loading.classList.remove("hidden");
    container.innerHTML = "";
}

function hideLoading() {
    loading.classList.add("hidden");
}

function showError(message) {
    errorDiv.textContent = `Error: ${message}`;
    errorDiv.classList.remove("hidden");
}

function displayUsers(users) {
    container.innerHTML = users.map(user => `
        <div class="user-card">
            <h2>${user.name}</h2>
            <p>📧 ${user.email}</p>
            <p>🏢 ${user.company.name}</p>
            <p>📍 ${user.address.city}</p>
        </div>
    `).join("");
}

// Initialize
loadUsers();



// Build: Create a form that submits a new post and displays the result
const postForm = document.getElementById("post-form");

postForm.addEventListener("submit", async (e) => {
  e.preventDefault(); 
    const title = document.getElementById("post-title").value;
    const body = document.getElementById("post-body").value;
    const userId = document.getElementById("post-user-id").value;
    const newPost = {
      title,
      body,
      userId
    };

    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newPost)
        });
        if (!response.ok) {
            throw new Error("Failed to create post");
        }
        const createdPost = await response.json();
        output.innerHTML = `
            <h2>Post Created</h2>
            <p><strong>Title:</strong> ${createdPost.title}</p>
            <p><strong>Body:</strong> ${createdPost.body}</p>
            <p><strong>User ID:</strong> ${createdPost.userId}</p>
        `;
    } catch (error) {
        showError(error.message);
    }
});

// live search
let allUsers = [];

async function loadAllUsers() {
  allUsers = await fetchData("https://jsonplaceholder.typicode.com/users");


displayUsers(allUsers);

setupSearch();
setupSort();
setupcityFilter();

}

function displayUsers(users) {
    const container = document.getElementById("users-list");
    container.innerHTML = "";
    users.forEach(user => {
        const userDiv = document.createElement("div");
        userDiv.innerHTML = `
            <h3>${user.name}</h3>
            <p>📧 ${user.email}</p>
            <p>🏢 ${user.company.name}</p>
            <p>📍 ${user.address.city}</p>
        `;
        container.appendChild(userDiv);
    });
}

function setupSearch() {
    const searchInput = document.getElementById("search-input");

    searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredUsers = allUsers.filter(user => 
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            user.company.name.toLowerCase().includes(searchTerm) ||
            user.address.city.toLowerCase().includes(searchTerm)
        );
        displayUsers(filteredUsers);
    });
}

function setupSort() {
    const sortSelect = document.getElementById("sort-select");

    sortSelect.addEventListener("change", () => {
        const sortBy = sortSelect.value;
        const sortedUsers = [...allUsers].sort((a, b) => {
            if (sortBy === "name") {
                return a.name.localeCompare(b.name);
            } else if (sortBy === "email") {
                return a.email.localeCompare(b.email);
            } else if (sortBy === "company") {
                return a.company.name.localeCompare(b.company.name);
            } else if (sortBy === "city") {
                return a.address.city.localeCompare(b.address.city);
            }
            return 0;
        });
        displayUsers(sortedUsers);
    });
}

function setupcityFilter() {
    const citySelect = document.getElementById("city-select");
    const cities = [...new Set(allUsers.map(user => user.address.city))];
    cities.forEach(city => {
        const option = document.createElement("option");
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
    });

    citySelect.addEventListener("change", () => {
        const selectedCity = citySelect.value;
        if (selectedCity === "all") {
            displayUsers(allUsers);
        } else {
            const filteredUsers = allUsers.filter(user => user.address.city === selectedCity);
            displayUsers(filteredUsers);
        }
    });
    }

    init();




















    