// import { marked } from 'marked';
// import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

const name = "restaurant";

const messages = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const voiceButton = document.getElementById('voiceButton');
const fileInput = document.getElementById('fileInput');
const fileButton = document.getElementById('fileButton');

// Function to launch confetti
function launchConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}

// function showLoading() {
//     const loadingCanvas = document.getElementById('loadingCanvas');
//     const ctx = loadingCanvas.getContext('2d');

//     // Set up noise
//     const width = loadingCanvas.width;
//     const height = loadingCanvas.height;

//     function generateNoise() {
//         const imageData = ctx.createImageData(width, height);
//         for (let i = 0; i < imageData.data.length; i += 4) {
//             const randomValue = Math.random() * 255;
//             imageData.data[i] = randomValue;     // R
//             imageData.data[i + 1] = randomValue; // G
//             imageData.data[i + 2] = randomValue; // B
//             imageData.data[i + 3] = 255;         // A
//         }
//         ctx.putImageData(imageData, 0, 0);
//     }

//     // Continuously generate noise until image is loaded
//     let noiseInterval = setInterval(generateNoise, 50);

//     // Stop noise and hide loading container once image is ready
//     return () => clearInterval(noiseInterval);
// }


// Adjust chat height on mobile when keyboard is opened
window.addEventListener('resize', function () {
    const chatContainer = document.querySelector('.chat-container');
    const inputContainer = document.querySelector('.input-container');
    const windowHeight = window.innerHeight;

    // Adjust height of chat container to fit available space
    chatContainer.style.height = windowHeight + 'px';
    inputContainer.style.bottom = '0'; // Stick input to the bottom
});

// Initialize chat container height on load
window.addEventListener('load', function () {
    const chatContainer = document.querySelector('.chat-container');
    const windowHeight = window.innerHeight;
    chatContainer.style.height = windowHeight + 'px';
});

async function getWeatherForDublin() {
    const lat = 53.3498;
    const lon = -6.2603;
    const exclude = 'minutely'; // Adjust as needed
    const apiKey = 'f4efc448132a55a1ae360717d81fb590'; // Replace with your actual API key

    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=${exclude}&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

async function getUserMetaData() {

    // Get the current date and time
    const now = new Date();
    // Format the date to include the day of the week, month names, and day numbers
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const currentDate = now.toLocaleDateString('en-US', options);
    const currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const location = "Dublin, Ireland"; // Replace with dynamic location fetching

    // Fetch weather data for Dublin, Ireland
    const weatherData = await getWeatherForDublin();
    const temperature = weatherData.current.temp;
    const weatherDescription = weatherData.current.weather[0].description;
    const weather = `${temperature}°C, ${weatherDescription}`;

    const userMetaData = `currentDate: ${currentDate}. currentTime: ${currentTime}. Location: ${location}. Weather: ${weather}`;

    return userMetaData;
}

function addMessage(text, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.textContent = text;
    messages.appendChild(messageElement);
    messages.scrollTop = messages.scrollHeight;
    return messageElement; // Return the created message element for further updates
}

function updateMessage(element, newText) {
    element.textContent = newText;
    messages.scrollTop = messages.scrollHeight;
}

// Convert markdown to HTML and update the message
function updateMessageWithMarkdown(messageElement, markdownText) {
    // Convert markdown to HTML using marked
    const htmlMessage = marked.parse(markdownText);

    // Update the element's innerHTML to render the HTML content
    messageElement.innerHTML = htmlMessage;
}

function addImageMessage(imageSrc, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    const imgElement = document.createElement('img');
    imgElement.src = imageSrc;
    messageElement.appendChild(imgElement);
    messages.appendChild(messageElement);
    messages.scrollTop = messages.scrollHeight;
}

function addOptions(options) {
    const optionsContainer = document.createElement('div');
    optionsContainer.classList.add('options-container');

    options.forEach(option => {
        const optionButton = document.createElement('button');
        optionButton.classList.add('option-button');
        optionButton.textContent = option;
        optionButton.addEventListener('click', () => {
            addMessage(option, 'user');
            handleUserSelection(option);
        });
        optionsContainer.appendChild(optionButton);
    });

    messages.appendChild(optionsContainer);
    messages.scrollTop = messages.scrollHeight;
}

async function getApiToken() {
    const response = await fetch('https://bl-lambda.free.beeceptor.com/access'); // Replace with your JSON file URL
    const data = await response.json();
    return data.api_key; // Adjust this to match the key in your JSON file
}

let userMetaData = '';
let messageList = [];

// Fetch user metadata
async function fetchUserMetaData() {
    if (userMetaData === '') {
        userMetaData = await getUserMetaData();
        console.log(userMetaData);
    }
    return userMetaData;
}

let apiToken = '';

// Fetch API token
async function fetchApiToken() {
    if (apiToken === '') {
        apiToken = await getApiToken();
    }
    return apiToken;
}

async function generateBotResponse(userInput, apiToken, modelType) {
    // Define endpoints and models for each service
    const apiConfig = {
        gpt: {
            url: 'https://api.openai.com/v1/chat/completions',
            model: 'gpt-4o-2024-08-06'
        },
        claude: {
            url: 'https://api.anthropic.com/v1/messages',
            model: 'claude-3-5-sonnet-20240620'
        },
        gemini: {
            url: 'https://api.google.com/v1/gemini/completions',
            model: 'gemini-1'
        },
        llama: {
            url: 'https://api.llama.com/v1/llama/completions',
            model: 'llama-2'
        }
    };

    // Ensure modelType is supported
    if (!apiConfig[modelType]) {
        throw new Error(`Unsupported model type: ${modelType}`);
    }

    const { url, model } = apiConfig[modelType];

    const requestHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`,
        // 'anthropic-version': `2023-06-01`,
        // 'x-api-key': `` 
    };

    // Extracted JSON Schema object
    const jsonSchema = {
        name: "assistant_response",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string" // New message field to provide additional information
                },
                options: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            suggestion: { type: "string" },
                            link: { type: "string" }
                        },
                        required: ["suggestion", "link"],
                        additionalProperties: false
                    }
                }
            },
            required: ["message", "options"], // Make 'message' required
            additionalProperties: false
        },
        strict: true
    };

    const requestBody = {
        model: model,
        messages: messageList,
        stream: true,
        max_tokens: 1024,
        response_format: {
            type: "json_schema",
            json_schema: jsonSchema
        }
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response;
}

// Handle the streamed response from the bot and provide suggestions in real-time
async function handleStreamedResponse(response) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let partialMessage = '';
    let accumulatedMessage = '';
    let cleanedMessage = ''; // This will store the message without options

    const messageElement = addMessage('', 'bot');
    let optionsShown = new Set(); // To track and avoid showing duplicate options

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        partialMessage += decoder.decode(value, { stream: true });
        const parts = partialMessage.split('\n\n');

        parts.slice(0, -1).forEach(part => {
            if (part === 'data: [DONE]') {
                // Add the final bot message to the global message list
                console.log(accumulatedMessage);
                messageList.push({ role: "system", content: accumulatedMessage });
                return;
            }

            try {
                const jsonPart = JSON.parse(part.replace(/^data: /, ''));
                const content = jsonPart.choices[0]?.delta?.content || '';
                if (content) {
                    accumulatedMessage += content;

                    // Extract options and clean message content
                    const { cleanedContent, currentOptions } = extractAndCleanOptions(accumulatedMessage);

                    // Convert the cleaned message (in markdown) to HTML and update the UI
                    if (cleanedContent !== cleanedMessage) {
                        cleanedMessage = cleanedContent; // Avoid redundant updates
                        updateMessageWithMarkdown(messageElement, cleanedMessage);
                    }

                    // Only show new options that haven't been displayed before
                    if (currentOptions && currentOptions.length > 0) {
                        const newOptions = currentOptions.filter(option => !optionsShown.has(option));

                        if (newOptions.length > 0) {
                            addClickableOptions(newOptions); // Display new options as buttons
                            newOptions.forEach(option => optionsShown.add(option)); // Track shown options
                        }
                    }
                }
            } catch (error) {
                console.error('Error parsing JSON:', error, part);
            }
        });

        partialMessage = parts[parts.length - 1];
    }

    // Call DALL·E API to generate an image based on the first suggestion
    generateImageWithDalle(cleanedMessage);
}

// Helper function to convert markdown to HTML
function convertMarkdownToHTML(markdownText) {
    // Using marked.js to convert markdown to HTML
    return marked.parse(markdownText);
}

function extractAndCleanOptions(responseText) {
    let cleanedContent = '';
    let currentOptions = [];

    try {
        // Attempt to parse the response text as JSON
        const parsedResponse = JSON.parse(responseText);

        // Extract the message if available
        if (parsedResponse.message) {
            cleanedContent = parsedResponse.message.trim();
        }

        // Extract options and format them if they exist
        if (Array.isArray(parsedResponse.options)) {
            currentOptions = parsedResponse.options.map(option => ({
                suggestion: option.suggestion.trim(),
                link: option.link.trim()
            }));
        }

    } catch (error) {
        // Handle incomplete or malformed JSON, attempt partial extraction using regex
        const messageMatch = responseText.match(/"message"\s*:\s*"([^"]*)"/);
        const optionsMatch = responseText.match(/"options"\s*:\s*\[(.*?)\]/);

        if (messageMatch) {
            cleanedContent = messageMatch[1].trim();
        }

        if (optionsMatch) {
            try {
                // Extract the options part from the partial JSON
                const optionsText = `[${optionsMatch[1]}]`;

                // Parse it as an array of options
                const optionsArray = JSON.parse(optionsText);
                currentOptions = optionsArray.map(option => ({
                    suggestion: option.suggestion.trim(),
                    link: option.link.trim()
                }));
            } catch (err) {
                // Handle parsing error of partial `options`
                console.warn('Failed to parse options from partial JSON:', err);
            }
        }
    }

    return {
        cleanedContent: cleanedContent || responseText, // Use raw text if JSON parsing failed
        currentOptions: currentOptions.length > 0 ? currentOptions.map(option => option.suggestion) : null
    };
}

const loadingMessage = 'Loading...'

function showLoading() {

    // addMessage(loadingMessage, 'bot')
    addImageMessage('assets/loading.gif', 'bot')
}

function getImageBySrc(srcPath) {
    const images = document.querySelectorAll('img');
    for (let img of images) {
        if (img.src.includes(srcPath)) {
            return img;
        }
    }
    return null;
}

function hideLoading() {

    const loadingImage = getImageBySrc('assets/loading.gif');
    if (loadingImage) {
        loadingImage.remove();
    } else {
        console.log("Loading Image not found!");
    }

}

//Create an enchanting in dark theme almost like pencil drawing depicting: 
// Function to generate an image using DALL·E API
async function generateImageWithDalle(prompt) {


    showLoading();

    const dalleApiUrl = 'https://api.openai.com/v1/images/generations';
    const dalleRequestBody = {
        model: "dall-e-3",
        prompt: "Create a well detailed epic games illustration poster of : " + prompt, // The suggestion text from competition responses
        n: 1,
        size: "1024x1024" // Adjust size as needed
    };

    const dalleResponse = await fetch(dalleApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiToken}`
        },
        body: JSON.stringify(dalleRequestBody)
    });

    const dalleData = await dalleResponse.json();
    if (dalleData && dalleData.data && dalleData.data.length > 0) {
        const imageUrl = dalleData.data[0].url;
        console.log('Generated Image URL:', imageUrl);
        // You can now display the image URL in the UI
        // showImage(imageUrl); // Function to display image in UI
        addImageMessage(imageUrl, "bot")
    } else {
        console.error('Failed to generate image');
    }

    hideLoading();
}


// Function to handle what happens when an option is clicked
function handleOptionClick(option) {
    addMessage(option, 'user'); // Display the selected option as a user's message
    getBotResponse(option);     // Send the selected option as a new user input to the bot
}

// Function to dynamically add clickable options to the UI
function addClickableOptions(options) {
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'options-container';

    options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.className = 'option-button';
        button.onclick = () => handleOptionClick(option); // Define how options should be handled
        optionsContainer.appendChild(button);
    });

    //document.getElementById('chat-box').appendChild(optionsContainer); // Append the options to the chat UI

    messages.appendChild(optionsContainer);
    messages.scrollTop = messages.scrollHeight; // Scroll to the bottom
}

// Define a mapping for suggestions based on the response type
const suggestionMap = {
    weather: ['Local weather updates', 'Weekly forecast', 'Weather in another city'],
    restaurants: ['Top restaurants nearby', 'Restaurant recommendations for dinner', 'Restaurants with outdoor seating'],
    events: ['Upcoming events', 'Music festivals', 'Nightlife options'],
    coffee: ['Best coffee shops nearby', 'Coffee places with Wi-Fi', 'Cozy places to work'],
    horoscope: ['Daily horoscope', 'Horoscope for the week', 'Compatibility readings'],
    general: ['General advice', 'Music recommendations', 'Fun facts about Dublin']
};

// Function to suggest options based on multiple response categories
function suggestOptionsBasedOnResponse(responseText) {
    const detectedCategories = [];

    // Check for keywords in the response and add corresponding categories
    if (responseText.toLowerCase().includes('weather')) {
        detectedCategories.push('weather');
    }
    if (responseText.toLowerCase().includes('restaurant')) {
        detectedCategories.push('restaurants');
    }
    if (responseText.toLowerCase().includes('event')) {
        detectedCategories.push('events');
    }
    if (responseText.toLowerCase().includes('coffee')) {
        detectedCategories.push('coffee');
    }
    if (responseText.toLowerCase().includes('horoscope')) {
        detectedCategories.push('horoscope');
    }

    // If no specific category is detected, default to 'general'
    if (detectedCategories.length === 0) {
        detectedCategories.push('general');
    }

    // Collect suggestions from all detected categories
    const suggestions = [];
    detectedCategories.forEach(category => {
        suggestions.push(...suggestionMap[category]);
    });

    // Optional: Limit the number of suggestions to prevent overload
    const maxSuggestions = 5;
    const uniqueSuggestions = [...new Set(suggestions)].slice(0, maxSuggestions);

    // Display the suggestions to the user
    addOptions(uniqueSuggestions);
}

// Main function to orchestrate the bot response flow
async function getBotResponse(userInput) {

    if (dev) {
        const messageElement = addMessage('', 'bot');
        updateMessageWithMarkdown(messageElement, 'dev test response');
    } else {
        // const userMetaData = await fetchUserMetaData();
        const apiToken = await fetchApiToken();

        // Add the user's message to the global message list
        messageList.push({ role: "user", content: userInput });
        const response = await generateBotResponse(userInput, apiToken, 'gpt');

        await handleStreamedResponse(response);
    }
}

async function handleUserSelection(selection) {
    updatedPrompt = `user selection: ${selection}.`;
    await getBotResponse(selection);
}

sendButton.addEventListener('click', async () => {
    const text = messageInput.value.trim();
    if (text !== '') {
        launchConfetti();
        addMessage(text, 'user');
        messageInput.value = '';

        await getBotResponse(text);

        if (text.toLowerCase().includes('weather')) {
            addOptions(['Dublin', 'London', 'New York']);
        }
    }
});

voiceButton.addEventListener('click', () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.start();
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        addMessage(transcript, 'user');
        getBotResponse(transcript);
    };
    recognition.onerror = (event) => {
        console.error('Error occurred in recognition: ', event.error);
    };
});

fileButton.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', () => {
    const files = fileInput.files;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const imageSrc = e.target.result;
                addImageMessage(imageSrc, 'user');
                setTimeout(() => addImageMessage(imageSrc, 'bot'), 1000);
            };
            reader.readAsDataURL(file);
        } else {
            addMessage(`File: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`, 'user');
            setTimeout(() => addMessage('Bot: Received file ' + file.name, 'bot'), 1000);
        }
    }
});

messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendButton.click();
    }
});


document.querySelectorAll('.profile').forEach(profile => {
    profile.addEventListener('click', (e) => {
        const conversationId = e.currentTarget.getAttribute('data-conversation');
        // loadConversation(conversationId);
        loadPrompt(conversationId);
    });
});

function loadConversation(conversationId) {
    // Here, you would implement the logic to load the messages for the selected conversation.
    // For demo purposes, let's just change the content of the messages div.
    const messages = document.getElementById('messages');
    messages.innerHTML = `<div class="message bot">Loaded conversation ${conversationId}</div>`;
}

// Dictionary containing conversation prompts
const conversations = {
    1: "You are a tiger",
    2: "You are a tiger",
    3: "You are a tiger",
    4: "You are a dog",
    5: "You are a bird"
};

// Function to load the prompt based on the conversationId
// async function loadPrompt(conversationId) {
//     // prompt = conversations[conversationId];

//     const response = await fetch("prompts/prompt1.txt");
//     prompt = await response.text();

//     if (prompt) {
//         // // If the prompt exists, load it into the chat view
//         // const messages = document.getElementById('messages');
//         // messages.innerHTML = `<div class="message bot">${prompt}</div>`;

//         // messageList = [{ role: "system", content: basePrompt + prompt }];  // Global message list
//     } else {
//         // If the prompt doesn't exist, display a default message
//         const messages = document.getElementById('messages');
//         messages.innerHTML = `<div class="message bot">Conversation not found!</div>`;
//     }
// }




async function loadPrompt() {

    
    var url;
    if (dev) {

        url = `https://creativeclub.ie/bandersnatch/prompts/${name}.txt`;
        // url = "https://creativeclub.ie/bandersnatch/prompts/doctor.txt";
    }
    else {

        url = `prompts/${name}.txt`;
        // url = "https://creativeclub.ie/bandersnatch/prompts/doctor.txt";

    }

    const response = await fetch(url);
    prompt = await response.text();

    if (prompt) {
        console.log(prompt);
        messageList = [{ role: "system", content: prompt }];
    } else {
        // If the prompt doesn't exist, display a default message
        const messages = document.getElementById('messages');
        messages.innerHTML = `<div class="message bot">prompt not found!</div>`;
    }
}

window.onload = async function () {

    if (dev){

    }else
    {
        await loadPrompt();
    }
    
    getBotResponse("start");
};