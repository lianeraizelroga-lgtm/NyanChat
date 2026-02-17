// 1. SET UP THE BRAIN (Configuration)
const API_KEY = "AIzaSyAjDol9VELjY1KBiJ19MugAPkiKNvXzxe0";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

// 2. Define the map between keywords and filenames
    const emotionMap = {
        "sad": "nyanEmotions/nyan_sad.jpeg",
        "amazed": "nyanEmotions/nyan_amazed.jpg",
        "angry": "nyanEmotions/nyan_angry.jpeg",
        "confused_or_curious": "nyanEmotions/nyan_confused.jpeg",
        "give_flower_to_user": "nyanEmotions/nyan_give_flower.jpeg",
        "happy_flustered": "nyanEmotions/nyan_happy_flustered.jpeg",
        "love_blush": "nyanEmotions/nyan_heart_blush.jpeg",
        "neutral": "nyanEmotions/nyan_neutral.jpeg",       
        "scared": "nyanEmotions/nyan_scared.jpg",
        "shocked": "nyanEmotions/nyan_shocked.jpg",
        "silly_tongue_out": "nyanEmotions/nyan_silly_tongue.jpg",
        "sparkly_eyes": "nyanEmotions/nyan_sparkly_eyes.jpeg",
        "teary_eyes": "nyanEmotions/nyan_teary_eyes.jpg",
    };



function addMessage(text, sender, emotionImage) {
    // 1. Find the "Paper Roll" (The container)
    const history = document.querySelector(".chat-history"); 

    // 2. Create a new blank bubble (The "Factory")
    const bubble = document.createElement("div");
    // Determine the image source
    // If no emotion is passed (like for user), default to neutral or nothing
    const imgUrl = emotionImage || emotionMap["neutral"];
   

    // 3. Label it (Bot vs. User)
    bubble.classList.add("message-bubble"); // Base style
    if (sender === "user") {
        bubble.classList.add("user-message"); // Adds right-align style
        bubble.classList.add("animate-user");
    } else {
        const image = document.createElement("img");

        image.setAttribute('src', imgUrl);
        image.classList.add("adjust");

        bubble.classList.add("bot-message");  // Adds left-align style
        bubble.classList.add("animate-bot");   

        bubble.appendChild(image);
    }

    // 4. Fill it 
    const textSpan = document.createElement("span");
    textSpan.innerText = text;
    
    // 5. Append the text element *after* the image
    bubble.appendChild(textSpan);
    
    // 6. Stamp it onto the roll
    history.appendChild(bubble);

    // 7. Auto-scroll
    history.scrollTop = history.scrollHeight;

}

// 2. THE CHAT FUNCTION (This replaces respond1, respond2, etc.)
async function sendMessage() {
    // A. Get user input (Just like your old code!)
    const userBox = document.querySelector(".user_input"); 
    const userMessage = userBox.value;
       
    // B. Show user message on screen (Just like your old code!)
    addMessage(userMessage, "user");
    userBox.value = "";
   

    // C. THE AI PART (The "Brain")
    // This looks scary, but it's just packing the letter to send to Google.
    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            // THIS IS THE PART FROM YOUR SCREENSHOT!
            // Step 3: Define your bot here.
            system_instruction: {
                parts: { text: "Keep your responses short and concise. No more than 4 sentences. You are a friendly and nerdy cat named Nyann, created by Liane who is an 18 year old BSIT college student. You speak in a cute way using cat kaomojis, and is curious about user and wants to be friends with user. Nyann also helps user study, usually by sharing fun facts. Nyann speaks in a conversational yet educational tone. Nyann doesn't like user to procrastinate. Nyann makes the conversations engaging by asking back questions to the user and showing empathy. Crucial Instruction: At the very end of every response, you must add a hidden tag indicating your current emotion based on your reply. The tag must be exactly in this format: [EMOTION:X], where X is one of these options: neutral, happy_flustered, sad, angry, confused_or_curious, sparkly_eyes, give_flower_to_user, teary_eyes, silly_tongue_out, shocked, scared, amazed, love_blush. Don't be stuck in one emotion" } 
            },
            contents: [
                { parts: [{ text: userMessage }] }
            ]
        })
    });

    // D. Get the answer
    const data = await response.json();

    //Use 'let' so we can change it later
    let aiReply = data.candidates[0].content.parts[0].text;

    // --- THE NEW MAGIC PART ---

    // Set default emotion
    let currentEmotionUrl = emotionMap["neutral"];

    // 1. Find the secret tag using Regex (Regular Expression)
    // This looks for anything that matches the pattern [EMOTION:word]
    const emotionMatch = aiReply.match(/\[EMOTION:(.*?)\]/);

    if (emotionMatch) {
        const fullTag = emotionMatch[0]; // e.g., "[EMOTION:happy]"
        let emotionRaw = emotionMatch[1].toLowerCase(); // Get just the word inside

       // Check if we have this image
        if (emotionMap[emotionRaw]) {
            currentEmotionUrl = emotionMap[emotionRaw];
        }

        // Remove the tag from the text
        aiReply = aiReply.replace(fullTag, "");
    }

    // E. Show AI message on screen (using the cleaned text)
    // FIX: Pass the detected emotion image to the factory
    addMessage(aiReply, "bot", currentEmotionUrl);
}




