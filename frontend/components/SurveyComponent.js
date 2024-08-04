"use client"; // Ensure this file is treated as a Client Component

import React from "react";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.min.css";
import { themeJson } from "./theme";
import { json } from "./json";
import { useUser } from '@auth0/nextjs-auth0/client';
import axios from "axios";

function SurveyComponent() {
    const survey = new Model(json);
    survey.applyTheme(themeJson);
    const { user, error, isLoading } = useUser();

    survey.onComplete.add(async (sender, options) => {
        // Extract survey data
        const surveyData = sender.data;

        // Define the questions to check
        const questionsToCheck = [
            'question6', 'question7', 'question8', 'question9',
            'question10', 'question11', 'question12', 'question13',
            'question14', 'question15'
        ];

        // Initialize counter
        let trueCount = 0;

        // Count the number of true values for specified questions
        questionsToCheck.forEach(questionId => {
            if (surveyData[questionId] === true) {
                trueCount++;
            }
        });

        console.log(`Number of true values: ${trueCount}`);

        // Send data to your backend
        try {
            await axios.get(`http://localhost:5001`);
            const initialRes = await axios.post(`http://localhost:5001/storeUserSurvey`, {
                username: user.name,
                email: user.email,
                surveyData: surveyData,
                trueCount: trueCount // Include the count in the data sent to the backend
            });
            console.log(initialRes.data);
        } catch (error) {
            console.error('Error sending survey data:', error);
        }
    });

    return (<Survey model={survey} />);
}

export default SurveyComponent;
