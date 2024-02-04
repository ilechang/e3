$(document).on("click",  "#speak", init);

function init(){

    // TODO: RECOGNIZE
    const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechGrammarList =
  window.SpeechGrammarList || window.webkitSpeechGrammarList;
const SpeechRecognitionEvent =
  window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

  const recognition = new SpeechRecognition();
const speechRecognitionList = new SpeechGrammarList();
// recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

recognition.start();

recognition.onresult = (event) => {
    const color = event.results[0][0].transcript;

    console.log(`Confidence: ${event.results[0][0].confidence}`);
    $("#query").val(color);
    $("#submit").click();
  };
}


$(document).on("click",  "#submit", send);

function send(){

    var text = $("#query").val();

    if (text == "") {

        alert("Write something!");
        
    } else {

        $("#output").append("Me: ");
        $("#output").append(text);
        $("#output").append("<br />");
        $("#query").val("");

        $.ajax({
        url: 'https://api.openai.com/v1/chat/completions',
        crossDomain: true,
        method: 'post',
        headers: {
            'Authorization': 'Bearer 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'
        },
        contentType: 'application/json',
        data: JSON.stringify({
            'model': 'gpt-3.5-turbo',
            'messages': [
            {
                'role': 'system',
                'content': 'You are my expert advisor specialized in Canada. Only speak to me in English, and keep the response to one or two sentences max.'
            },
            {
                'role': 'user',
                'content': text
            },
            {
                'role': 'assistant',
                'content': 'Refer to the following conversation. '+$("#output").text()
            }
            ]
        })
        }).done(function(response) {

            var reply = response.choices[0].message.content;
            
            $("#output").append("GPT: ");
            $("#output").append(reply);
            $("#output").append("<br />");

            // TODO: SYNTHESIZE TEXT
            const synth = window.speechSynthesis;
            const voices = synth.getVoices();

            const utterThis = new SpeechSynthesisUtterance(reply);
            utterThis.voice = voices[0];
            utterThis.pitch = 1;
            utterThis.rate = 1;
            synth.speak(utterThis)
        });


    }

}
