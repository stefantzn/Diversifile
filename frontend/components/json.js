export const json = {
  "title": "Welcome To Diversifile",
  "description": "Answer a few questions and our AI will compute a personalized portfolio tailored to your responses.",
  "logoPosition": "right",
  "pages": [
    {
      "name": "page1",
      "title": "Personal Information",
      "elements": [
        {
          "type": "text",
          "name": "question2",
          "title": "What is your name?"
        },
        {
          "type": "text",
          "name": "question1",
          "title": "Enter your Birthday",
          "inputType": "date"
        },
        {
          "type": "text",
          "name": "question5",
          "title": "Where are you from?"
        }
      ]
    },
    {
      "name": "page2",
      "title": "Financial Information",
      "description": "To give us perspective on your current financial information to select the correct portfolio for you.",
      "elements": [
        {
          "type": "text",
          "name": "question3",
          "title": "What is your annual salary?",
          "inputType": "number"
        },
        {
          "type": "text",
          "name": "question4",
          "title": "How much do you have saved?",
          "inputType": "number"
        }
      ]
    },
    {
      "name": "page3",
      "title": "Burning Questions",
      "description": "These questions will help determine the type of portfolio that best suits your personality",
      "elements": [
        {
          "type": "boolean",
          "name": "question6",
          "title": "Do you enjoy meeting new people and engaging in social activities frequently?"
        },
        {
          "type": "boolean",
          "name": "question7",
          "title": "Are you energized by being in busy, active environments?"
        },
        {
          "type": "boolean",
          "name": "question8",
          "title": "Do you often prioritize others' needs and feelings over your own when making decisions?"
        },
        {
          "type": "boolean",
          "name": "question9",
          "title": "Do you find it easy to trust others and believe in their good intentions?"
        },
        {
          "type": "boolean",
          "name": "question10",
          "title": "Do you actively seek out new experiences, even if they are unconventional or unfamiliar?"
        },
        {
          "type": "boolean",
          "name": "question11",
          "title": "Are you curious about exploring new ideas and different perspectives?"
        },
        {
          "type": "boolean",
          "name": "question12",
          "title": "Do you tend to follow through on your commitments and responsibilities without procrastination?"
        },
        {
          "type": "boolean",
          "name": "question13",
          "title": "Do you often feel anxious or worried about your decisions and their potential consequences?"
        },
        {
          "type": "boolean",
          "name": "question14",
          "title": "Do you frequently experience self-doubt and second-guess your choices?"
        },
        {
          "type": "boolean",
          "name": "question15",
          "title": "Do you meticulously plan and organize your tasks and activities to ensure everything is in order?"
        }
      ]
    },
    {
      "name": "page4",
      "title": "Bonus Question",
      "elements": [
        {
          "type": "dropdown",
          "name": "question16",
          "title": "Pick a theme for the last question",
          "choices": [
            {
              "value": "Item 1",
              "text": "Sports"
            },
            {
              "value": "Item 2",
              "text": "Anime"
            },
            {
              "value": "Item 3",
              "text": "Disney"
            },
            {
              "value": "Item 4",
              "text": "YouTube"
            }
          ]
        }
      ]
    },
    {
      "name": "page5",
      "title": "Sports",
      "elements": [
        {
          "type": "dropdown",
          "name": "question17",
          "title": "Who is the greatest player of all time",
          "choices": [
            {
              "value": "Item 1Sh",
              "text": "LeBron James"
            },
            {
              "value": "Item 2",
              "text": "Stephen Curry"
            },
            {
              "value": "Item 3",
              "text": "Leonel Messi"
            },
            {
              "value": "Item 4",
              "text": "Christiano Ronaldo"
            },
            {
              "value": "Item 6",
              "text": "Connor McDavid"
            },
            {
              "value": "Item 7",
              "text": "Shohei Ohtani"
            },
            {
              "value": "Item 8",
              "text": "Other"
            }
          ]
        }
      ]
    },
    {
      "name": "page6",
      "title": "Anime",
      "elements": [
        {
          "type": "dropdown",
          "name": "question18",
          "title": "Who is your favourite Anime Character",
          "choices": [
            {
              "value": "Item ",
              "text": "Light Yagami"
            },
            {
              "value": "Item 2",
              "text": "Eren Yeager"
            },
            {
              "value": "Item 3",
              "text": "Naruto Uzumaki"
            },
            {
              "value": "Item 4",
              "text": "Sakura Haruno"
            },
            {
              "value": "Item 5",
              "text": "Emilia"
            },
            {
              "value": "Item 6",
              "text": "Tanjiro Kamado"
            },
            {
              "value": "Item 7",
              "text": "Other"
            }
          ]
        }
      ]
    },
    {
      "name": "page7",
      "title": "Disney",
      "elements": [
        {
          "type": "dropdown",
          "name": "question19",
          "title": "What is your favourite Disney film?",
          "choices": [
            {
              "value": "Item 1",
              "text": "Frozen"
            },
            {
              "value": "Item 2",
              "text": "Moana"
            },
            {
              "value": "Item 3",
              "text": "The Incredibles"
            },
            {
              "value": "Item 4",
              "text": "Monsters Inc"
            },
            {
              "value": "Item 5",
              "text": "Toy Story"
            },
            {
              "value": "Item 6",
              "text": "Zootopia"
            },
            {
              "value": "Item 7",
              "text": "Other"
            }
          ]
        }
      ]
    },
    {
      "name": "page8",
      "title": "YouTube",
      "elements": [
        {
          "type": "dropdown",
          "name": "question20",
          "title": "Who is your favourite YouTuber?",
          "choices": [
            {
              "value": "Item ",
              "text": "MrBeast"
            },
            {
              "value": "Item 2",
              "text": "Dream"
            },
            {
              "value": "Item 3",
              "text": "IShowSpeed"
            },
            {
              "value": "Item 4",
              "text": "Kai Cenat"
            },
            {
              "value": "Item 5",
              "text": "Mark Rober"
            },
            {
              "value": "Item 6",
              "text": "Pokimane"
            },
            {
              "value": "Item 7",
              "text": "Other"
            }
          ]
        }
      ]
    }
  ],
  "triggers": [
    {
      "type": "skip",
      "expression": "{question16} = 'Item 1'",
      "gotoName": "question17"
    },
    {
      "type": "skip",
      "expression": "{question16} = 'Item 2'",
      "gotoName": "question18"
    },
    {
      "type": "skip",
      "expression": "{question16} = 'Item 3'",
      "gotoName": "question19"
    },
    {
      "type": "skip",
      "expression": "{question16} = 'Item 4'",
      "gotoName": "question20"
    },
    {
      "type": "complete",
      "expression": "{question17} anyof ['Item 1Sh', 'Item 2', 'Item 3', 'Item 4', 'Item 7', 'Item 6', 'Item 8']"
    },
    {
      "type": "complete",
      "expression": "{question18} anyof ['Item 7', 'Item 6', 'Item 5', 'Item 4', 'Item 3', 'Item 2', 'Item ']"
    },
    {
      "type": "complete",
      "expression": "{question19} anyof ['Item 7', 'Item 6', 'Item 5', 'Item 3', 'Item 4', 'Item 2', 'Item 1']"
    },
    {
      "type": "complete",
      "expression": "{question20} anyof ['Item 7', 'Item 6', 'Item 5', 'Item 4', 'Item 3', 'Item ', 'Item 2']"
    }
  ],
  "showCompletedPage": false,
  "navigateToUrl": "portfolio",
  "navigateToUrlOnCondition": [
    {}
  ]
}