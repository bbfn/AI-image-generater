const generateform = document.querySelector(".generate-form");
const imageGallery = document.querySelector("generate-form");

const OPENAI_API_KEY = "sk-965NM07hk1vmSu7VSdETT3B1bkFJiSjp9xi4xhJDWrQkm8si";
let isImageGenerating = false;


const updateImageCard = (ImageDataArray) => {
    ImageDataArray.forEach((imgObject, index) => {
        const imgCard = imageGallery.querySelectorAll("img");
        const imgElement = imgCard.querySelector("img");
        const downloadBtn = imgCard.querySelector(".download-btn");
 

        //set the image source to the AI-generated image data
        const aiGeneratedImg = `data:image/jpeg;based64,${imgObject.b64_json}`;
        imgElement.src = aiGeneratedImg;

        
        imgElement.onload = () =>{
            imgCard.classList.remove("loading");
            downloadBtn.setAttribute("href", aiGeneratedImg);
            downloadBtn.setAttribute("download" , `${new Date ().getTime()}.jpg`);
        }
    });
}
const generateAiImages = async (userPrompt, userImgQuantity) => {
    try {
const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`

    },
    body: JSON.stringify({
        prompt: userPrompt,
        n: parseInt(userImgQuantity),
        size: "512*512",
       response_format: "b64_json"
    })
});

    if(!response.ok) throw new Error("failed to generate images! please try again.");

    const { data } = await response.json(); //Get data from the response
    updateImageCard([...data]);
    } catch (error) {
        alert(error.message);
    } finally {
        isImageGenerating = false;
    }
}


const handleFormSubmission = (e) => {
    e.preventDefault();
    if(isImageGenerating) return;
    isImageGenerating = true;

    // get user input and image quantity values from the fom
    const userPrompt = e.srcElement[0].value;
    const userImgQuantity = e.srcElement[1].value;

    //creating HTML markup for image cards with loading state
    const imgCardMarkup  = Array.from({length: userImgQuantity}, () =>
     `<div class="img-card loading">
     <img src="images/image-1.jpg" alt="image">
     <a href="#" class="download-btn">
         <img src="images/dwn.webp" alt="download icon">
     </a>
 </div>`
     ).join("");

     imageGallery.innerHTML = imgCardMarkup;
     generateAiImages(userPrompt, userImgQuantity);
}


generateform.addEventListener("submit", handleFormSubmission);
