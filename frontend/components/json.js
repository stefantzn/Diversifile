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
            "title": "Would you eat your least favourite food if someone offered you $20?"
          },
          {
            "type": "boolean",
            "name": "question7",
            "title": "Would you go on a blind date set up by your most unpredictable friend?"
          },
          {
            "type": "boolean",
            "name": "question8",
            "title": "Are you afraid of skydiving?"
          }
        ]
      }
    ]
  }