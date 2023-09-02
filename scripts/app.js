let navbar = document.querySelector(".navbar");
let navlink = document.querySelectorAll(".nav-link");
let homepagemain = document.getElementById("homepage-main");
let expandtf1 = false;
let expandtf2 = false;

navbar.addEventListener('mouseover', () => {
    expandtf1 = true;
    if (!homepagemain.classList.contains("expand13"))
        homepagemain.classList.toggle('expand13');
});
navlink.forEach(element => element.addEventListener('mouseover', () => {
        expandtf2 = true;
        if (!homepagemain.classList.contains("expand13"))
            homepagemain.classList.toggle('expand13');
    })
);
navbar.addEventListener('mouseleave', () => {
    expandtf1 = false;
    if (!expandtf1 && !expandtf2)
        homepagemain.classList.toggle('expand13');
});
navlink.forEach(element => element.addEventListener('mouseover', () => {
        expandtf2 = false;
        if (!expandtf1 && !expandtf2) 
            homepagemain.classList.toggle('expand13');
    })
);
