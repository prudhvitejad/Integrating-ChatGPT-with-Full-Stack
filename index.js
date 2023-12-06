const express = require("express");
const app = express();

app.get("/generate", async (req,res,next) => {
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: "How are you today?",
    });
    console.log(completion.data.choices[0].text);
    res.send(completion.data.choices[0].text);
})

async function runCompletion(inputText) {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: inputText,
    });
    console.log(completion.data.choices[0].text);
}

runCompletion("First 5 even numbers");

app.listen(3000, ()=> {console.log("App is listening at 3000")});


