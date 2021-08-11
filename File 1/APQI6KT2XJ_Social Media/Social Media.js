const userName = document.getElementById("userName");
const password = document.getElementById("password");
const loginForm = document.getElementById("loginForm");
const createForm = document.getElementById("createForm");
let user;
let postsContainerElm = document.getElementById("postsContainer");
let jsonData;

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (userName.value === "user1" && password.value === "pass1") {
        user = "1";
        display('sectionHome');
        getPosts();
    } else if (userName.value === "user2" && password.value === "pass2") {
        user = "2";
        display('sectionHome');
        getPosts();
    }
    userName.value = "";
    password.value = "";

});

createForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    let title = document.getElementById("createTitle")
    let imageLink = document.getElementById("createImageLink")
    let description = document.getElementById("createDescription")
    let errorMsg = document.getElementById("errorMsg")
    let data = {
        Title: title.value,
        Description: description.value,
        Image: imageLink.value,
    }
    let responseObj = await sendPost(data)
    console.log(responseObj)
    if (typeof(responseObj) === "string") {
        errorMsg.textContent = "Reqest Error: " + responseObj
    } else {
        errorMsg.textContent = ""
        title.value = ""
        imageLink.value = ""
        description.value = ""
        getPosts()
    }
});

async function sendPost(data) {
    let url = "https://606312790133350017fd282e.mockapi.io/api/v1/posts/";
    let options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(data),
    };
    try {
        let response = await fetch(url, options)
        let jsonData = await response.json()
        return jsonData
    } catch (e) {
        console.log(e.message)
    }
}


async function getPosts() {
    postsContainerElm.textContent = ""
    let url = "https://606312790133350017fd282e.mockapi.io/api/v1/posts/";
    let options = {
        method: "GET",
    };
    let response = await fetch(url, options);
    jsonData = await response.json();
    jsonData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    let i = 0
    for (let postObj of jsonData) {
        createPost(postObj);
    }
    //createPost(jsonData[5], true)
}

function createPost(postObj, prep = false) {
    let commentLen = postObj.Comments.length;
    let postId = "post" + postObj._id;
    let imageID = "image" + postObj._id;
    let titleId = "title" + postObj._id;
    let linkId = "link" + postObj._id;
    let postUser = postObj._id % 2 === 0 ? "2" : "1"


    let listElm = document.createElement("li");
    listElm.id = postId;
    listElm.classList.add("post-container", "shadow");
    if (prep === true) {
        postsContainerElm.prepend(listElm);
    } else {
        postsContainerElm.appendChild(listElm);
    }

    let userElm = document.createElement("h1");
    userElm.classList.add("post-username");
    userElm.textContent = "USER " + postUser;
    listElm.appendChild(userElm);

    let imageElm = document.createElement("img");
    imageElm.id = imageID;
    imageElm.src = postObj.Image; //"http://lorempixel.com/640/480/cats"
    imageElm.classList.add("post-img");
    imageElm.onclick = () => showDetails(postObj._id);
    listElm.appendChild(imageElm);

    let divElm = document.createElement("div");
    divElm.classList.add("post-title-comment");
    listElm.appendChild(divElm);

    let headElm = document.createElement("h1");
    headElm.id = titleId;
    headElm.classList.add("post-title");
    headElm.textContent = postObj.Title;
    headElm.onclick = () => showDetails(postObj._id);
    divElm.appendChild(headElm);

    let linkElm = document.createElement("a");
    linkElm.id = linkId;
    linkElm.classList.add("post-comment");
    linkElm.textContent = commentLen + " comments";
    linkElm.onclick = () => showDetails(postObj._id);
    divElm.appendChild(linkElm);

    let paraElm = document.createElement("p");
    paraElm.classList.add("post-description");
    paraElm.textContent = postObj.Description;

    if (user !== postUser) {
        paraElm.classList.add("addMargin");
        listElm.appendChild(paraElm);
    } else {
        listElm.appendChild(paraElm);

        let btnDivElm = document.createElement("div");
        btnDivElm.classList.add("d-flex", "flex-row", "justify-content-end", "mr-2");
        listElm.appendChild(btnDivElm);

        let editButton = document.createElement("button");
        editButton.classList.add("btn", "btn-secondary");
        editButton.textContent = "Edit Post";
        btnDivElm.appendChild(editButton);

        let deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.classList.add("btn", "btn-outline-danger", "ml-2");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = () => {

            if (confirm('Are you sure you want to Delete?')) {
                deletePost(postObj._id);
            } else {
                console.log('Not Deleted');
            }

        }
        btnDivElm.appendChild(deleteButton);
    }

    postsContainerElm = document.getElementById("postsContainer");
}
async function deletePost(objId) {
    let url = `https://606312790133350017fd282e.mockapi.io/api/v1/posts/${objId}`;
    let options = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    };
    try {
        let response = await fetch(url, options)
        let jsonData = await response.json()
        let listId = "post" + objId
        let listElm = document.getElementById(listId)
        postsContainerElm.removeChild(listElm)
    } catch (e) {
        console.log(e.message)
    }


}
async function showDetails(objId) {
    let postIdInt = objId;
    //event.target.id.replace(/^\D+/g, '')
    let specPostObjIndex = jsonData.findIndex((obj) => obj._id === postIdInt ? true : false);
    let specPostObj = jsonData[specPostObjIndex];
    let postDetailsContainerElm = document.getElementById("postDetailsContainer");
    postDetailsContainerElm.textContent = ""
    postsContainerElm = document.getElementById("postDetailsContainer");
    createPost(specPostObj);


    let url = `https://606312790133350017fd282e.mockapi.io/api/v1/posts/${postIdInt}/comments`;
    let options = {
        method: "GET",
    };
    let response = await fetch(url, options);
    let commentObjects = await response.json();
    commentObjects.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    //let commentArray= commentObjects.map((obj)=> obj.comment)

    let commentsContainer = document.createElement("ul");
    commentsContainer.classList.add("comments-container");
    postDetailsContainerElm.appendChild(commentsContainer);
    for (let commentObj of commentObjects) {
        let listElm = document.createElement("li");
        listElm.id = "comment" + commentObj.id;
        listElm.classList.add("comment-container");
        commentsContainer.appendChild(listElm);

        let paraElm = document.createElement("p");
        paraElm.classList.add("comment-text");
        paraElm.textContent = commentObj.comment;
        listElm.appendChild(paraElm);
    }

    display('sectionDetailedView');
}