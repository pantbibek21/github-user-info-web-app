//accessing the elements
const container = document.querySelector(".container");
const input = document.querySelector(".header input");
const searchBtn = document.querySelector(".header #search-btn");
const clearBtn = document.querySelector(".header #clear-btn");
const notification = document.querySelector(".notification-msg");
const personalRepoWrapper = document.querySelector(".personal-repos");
const forkedRepoWrapper = document.querySelector(".forked-repos");
let totalRepos = 0;
let starEarnCount = 0;
let totalCommits = 0;

//validating the username
const validateUser = function () {
    let userName = input.value;
    if (userName == "" || userName.trim() == "") {
        showNotification("Invalid username 😭, search again :(")
        return;
    }
    if (userName.trim().split(" ").length > 1) {
        showNotification("Invalid username 😭,username cannot have space :(")
        return;
    }

    userName = userName.toLowerCase();
    resetData();
    fetchDetails(userName);

}

//showing the notification to user
function showNotification(msg) {
    notification.innerHTML = msg;
}

//clearing the notification message from UI
function clearNotification() {
    notification.innerHTML = "";
    input.value = "";
    container.style.opacity = 0;
    resetData();
}


//adding event listener to search button
searchBtn.addEventListener("click", validateUser);

//adding event listener to clearn button
clearBtn.addEventListener("click", clearNotification);

//firing  validateuser() on hitting enter
document.onkeydown = (e) => {
    if (e.key == 'Enter') {
        resetData();
        validateUser();
    }
}

//fetching the valid user details
async function fetchDetails(username) {
    try{
        const responseFromRepo = await fetch(`https://api.github.com/users/${username}/repos`);
        if(!responseFromRepo.ok){
            if(responseFromRepo.status == 404){
                throw new Error("Couldn't find user");
            }
            throw new Error();
        }
        const userRepoData = await responseFromRepo.json();
        renderRepos(userRepoData);
    
        const userDetailResponse = await fetch(`https://api.github.com/users/${username}`);
        if(!userDetailResponse.ok){
            throw new Error();
        }
        const userDetailData = await userDetailResponse.json();
        renderUserDetail(userDetailData);
    
        const response = await fetch(userDetailData.organizations_url);
        if(!response.ok){
            throw new Error();
        }
        const data = await response.json();
        fetchOrganizationDetail(data);
        container.style.opacity = 1;
    }
    catch(error){
        const msg = `Sorry, an error occured : ${error.message}😭`;
        showNotification(msg)
    }
   
}

//count commits 
async function countCommits(repoUrl) {
    let response = await fetch(repoUrl);
    let data = await response.json();
    countCommits += data.length;
}
//render user repos

function renderRepos(dataObjArr) {
    dataObjArr.forEach((data) => {

        starEarnCount += data.stargazers_count;

        //API limit reached while counting total no of commits

        // let deleteStartIndex = (data.commits_url).indexOf("{");
        // let commitUrl = data.commits_url.slice(0, deleteStartIndex);

        //  countCommits(commitUrl);
        //identify if the repo is forked or not

        let repoTemplate = ` <div class="repo">
                <h3 class="repo-name">${data.full_name}</h3>
                <p class="description">${data.description ?? "No description available."}</p>
                <p class="languages"><span class="label">languages : </span>${data.language ?? "No language information available."}</p>
                <p class="repo-created-on"><span class="label">repo created at : </span>${data.created_at.split("T")[0]}</p>
                <p class="repo-updated-on"><span class="label">repo updated at : </span>${data.updated_at.split("T")[0]}</p>
                <a href="${data.html_url}" class="repo-link">Repo Link <i class="fa-solid fa-link"></i></a>
                </div>`;

        if (data.fork) {
            forkedRepoWrapper.insertAdjacentHTML("beforeend", repoTemplate);
        }
        else {
            personalRepoWrapper.insertAdjacentHTML("beforeend", repoTemplate);
        }
    })
    totalRepos = dataObjArr.length;


}

//render user details
const nameOfUser = document.querySelector(".nameOfUser");
const userName = document.querySelector(".username");
const locationOfUser = document.querySelector(".location");
const website = document.querySelector(".website");
const twitter = document.querySelector(".twitter");
const publicRepo = document.querySelector(".public-repo");
const starEarned = document.querySelector(".star-earn");
const commits = document.querySelector(".total-commits");
const createdOn = document.querySelector(".created-on");
const lastCommitedOn = document.querySelector(".last-commited-on");
const bio = document.querySelector(".bio");
const followers = document.querySelector(".followers-count");
const following = document.querySelector(".following-count");
const userProfile = document.querySelector(".user-profile");
const nameInCard = document.querySelector(".nameInCard");
const usernameInCard = document.querySelector(".usernameInCard");
const organization = document.querySelector(".organizations");
console.log(organization)
// const organizationName = document.querySelector(".organizationName");
// const organizationAvatar = document.querySelector(".organizationAvatar img");

function renderUserDetail(data) {
    nameOfUser.innerHTML = data.name;
    userName.innerHTML = data.login;
    locationOfUser.innerHTML = data.location ?? "N/A";
    website.innerHTML = data.blog == "" ? "N/A" : data.blog;
    twitter.innerHTML = data.twitter_username ?? "N/A";
    publicRepo.innerHTML = totalRepos;
    starEarned.innerHTML = starEarnCount;
    commits.innerHTML = "API fetch limit reached : (";
    createdOn.innerHTML = data.created_at.split("T")[0];
    lastCommitedOn.innerHTML = data.updated_at.split("T")[0];
    bio.innerHTML = data.bio;
    followers.innerHTML = data.followers;
    following.innerHTML = data.following;
    userProfile.src = data.avatar_url;
    nameInCard.innerHTML = data.name;
    usernameInCard.innerHTML = data.login;
    usernameInCard.href = data.html_url;
}

async function fetchOrganizationDetail(data) {
    data.length == 0? organization.innerHTML = "N/A":
   data.forEach((ele)=>{
    let organizationTemplate =`<span class="organizationAvatar"><img src="${ele.avatar_url}" alt=""></span> <span class="organizationName">${ele.login}</span>`;
    organization.insertAdjacentHTML("beforeend",organizationTemplate);
  
})

    // organizationAvatar.src = data[0].avatar_url;
    // organizationName.innerHTML = data[0].login;
}

function resetData(){
    nameOfUser.innerHTML = "";
    userName.innerHTML = "";
    locationOfUser.innerHTML = "";
    website.innerHTML = "";
    twitter.innerHTML = "";
    publicRepo.innerHTML = "";
    starEarned.innerHTML = "";
    commits.innerHTML = "API fetch limit reached : (";
    createdOn.innerHTML = "";
    lastCommitedOn.innerHTML = "";
    bio.innerHTML = "";
    followers.innerHTML = "";
    following.innerHTML = "";
    userProfile.src = "";
    nameInCard.innerHTML = "";
    usernameInCard.innerHTML = "";
    organization.innerHTML = "";

    personalRepoWrapper.innerHTML = "";
    forkedRepoWrapper.innerHTML = "";

    container.style.opacity = 0;
}
