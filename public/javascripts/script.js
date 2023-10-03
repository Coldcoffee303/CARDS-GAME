const throttleFunction=(func, delay)=>{
    let prev = 0;
    return (...args) => {
        let now = new Date().getTime();
        // console.log(now-prev, delay);
        if(now - prev> delay){
            prev = now;
            return func(...args);
        }
    }
}

const imageUrls = [
    // "https://plus.unsplash.com/premium_photo-1671683370315-87306b0faf90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGNhcmQlMjBnYW1lfGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60",
    // "https://images.unsplash.com/photo-1611104866937-e7e05b8571b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGNhcmQlMjBnYW1lfGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60",
    // "https://images.unsplash.com/photo-1623522264952-8dff960ec8f2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGNhcmQlMjBnYW1lfGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60",
    "https://raw.githubusercontent.com/Coldcoffee303/CARDS-GAME/master/public/images/cards/grade1/E_1_1.png",
    "https://raw.githubusercontent.com/Coldcoffee303/CARDS-GAME/master/public/images/cards/grade1/W_1_1.png",
    "https://raw.githubusercontent.com/Coldcoffee303/CARDS-GAME/master/public/images/cards/grade1/L_1_1.png",
    "https://raw.githubusercontent.com/Coldcoffee303/CARDS-GAME/master/public/images/cards/grade1/F_1_1.png",
    // Add more image URLs as needed
  ];

document.querySelector("#center")
.addEventListener(
    "mousemove",
    throttleFunction((dets)=>{
        // code
        var div = document.createElement("div");
        div.classList.add('imagediv');
        div.style.left = dets.clientX+"px";
        div.style.top = dets.clientY+"px";

        var img = document.createElement("img");
        const randomImageUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];
        img.setAttribute("src",randomImageUrl);
        div.appendChild(img);

        gsap.to(img,{
            y:"0%",
            ease: Power1,
            duration: .6
        })

        gsap.to(img,{
            y:"100%",
            delay:.6,
            ease: Power2,
        })

        document.body.appendChild(div);
        setTimeout(function(){
            div.remove();
        },2000)
    }, 300)
);