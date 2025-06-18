const url = "https://api.github.com/users/";

const submitBtn = document.querySelector("[data-submit]");
const searchData = document.querySelector("[data-search-txt]");


searchData.addEventListener('keydown',async (e) => {
    if (e.key === 'Enter') {
        if (searchData.value !== "") {
            let add = searchData.value;
            const link = url + add;
            let data = await getData(link);
            pushData(data);
        }
    }
},false);

submitBtn.addEventListener('click' , async () => {
    let add = searchData.value;
    const link = url + add;
    let data = await getData(link);
    pushData(data);
})

const defaultadd = "Priyank0703";
const defaulLink = url + defaultadd;
async function defaultshow(defaultLink){
    const response = await fetch(defaulLink);
    const data = await response.json();
    pushData(data);
    return;
}
defaultshow();


async function getData(link){
    try {
        const response = await fetch(link);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log("there is error to fetch ->> " , error);
    }
}

const img = document.querySelector("[data-show-img]");
const gitName = document.querySelector("[data-name]");
const GitLink = document.querySelector("[data-git-link]");
const bioinfo = document.querySelector("[data-bio]");
const join = document.querySelector("[data-join]");
const repo = document.querySelector("[data-repo]");
const followers = document.querySelector("[data-followers]");
const following = document.querySelector("[data-following]");
const loc = document.querySelector("[data-loc]");
const bloglink = document.querySelector("[data-blog-link]");
const twitterlink = document.querySelector("[data-twitter]");
const company = document.querySelector("[data-company]");

function pushData(data){
    if (data && data.avatar_url) {
        img.src = data.avatar_url;
    }

    if (data && data.name) {
        gitName.innerHTML = data.name;
    } else if(data && data.login){
        gitName.innerHTML = data.login;
    }else{
        gitName.innerHTML = "user not found";
    }

    if(data && data.bio){
        bioinfo.innerHTML = data.bio;
    }else{
        bioinfo.innerHTML = "This Profile has no Bio."
    }

    GitLink.href = data.html_url;
    GitLink.innerHTML = `@${data.login}`;
    

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const joinDate = new Date(data.created_at);
    const formattedDate = `${joinDate.getDate()} ${monthNames[joinDate.getMonth()]} ${joinDate.getFullYear()}`;
    join.innerHTML = `joined ${formattedDate}`;

    repo.innerHTML = data.public_repos;

    followers.innerHTML = data.followers;
    following.innerHTML = data.following;

    if(data && data.location){
        loc.innerHTML = data.location;
    }else{
        loc.innerHTML = "Not Available";
    }

    if(data && data.blog){
        bloglink.href = data.blog;
        bloglink.innerHTML = data.login;
    }else{
        bloglink.innerHTML = "Not Available";
    }

    if(data && data.twitter_username){
        twitterlink.href = `https://twitter.com/${data.twitter_username}`;
        twitterlink.innerHTML = data.login;
    }else{
        twitterlink.innerHTML = "Not Available";
    }

    if(data && data.company){
        company.innerHTML = data.company;
    }else{
        company.innerHTML = "Not Available";
    }
}




// change theme code 
const theme = document.querySelector(".theme");
let colour = "Light";
theme.querySelector("span").innerText = colour;
theme.querySelector("img").src = "./Images/sun-icon.svg";

theme.addEventListener("click" , () => {
    if(colour === "Dark"){
        changeToDark();
    }else{
        changeToLight();
    }
})

const root = document.documentElement.style;


function changeToDark() {
    root.setProperty("--txtall", "#e0e0e0"); // Light text
    root.setProperty("--bgall", "#1e1e1e"); // Dark background
    root.setProperty("--containerall", "#2e2e2e"); // Darker container background
    root.setProperty("--border", "#444"); // Border color
    root.setProperty("--shadow", "rgba(0, 0, 0, 0.5)"); // Shadow color

    colour = "Light";
    theme.querySelector("span").innerText = colour;
    theme.querySelector("img").src = "./Images/sun-icon.svg";
}


function changeToLight() {
    root.setProperty("--txtall", "#333333"); // Dark text
    root.setProperty("--bgall", "#ffffff"); // Light background
    root.setProperty("--containerall", "#f9f9f9"); // Light container background
    root.setProperty("--border", "#cccccc"); // Border color
    root.setProperty("--shadow", "rgba(0, 0, 0, 0.1)"); // Shadow color

    colour = "Dark";
    theme.querySelector("span").innerText = colour;
    theme.querySelector("img").src = "./Images/moon-icon.svg";
}


