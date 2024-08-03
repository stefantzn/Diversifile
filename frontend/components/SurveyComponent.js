"use client"; 

import React from "react";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.min.css";
import { themeJson } from "./theme";
import { json } from "./json";

import { useUser } from '@auth0/nextjs-auth0/client';

const axios = require("axios");


function SurveyComponent() {
    const survey = new Model(json);
    survey.applyTheme(themeJson);
    const { user, error, isLoading } = useUser();

    survey.onComplete.add( async (sender, options) => {
        // const surveyData = JSON.stringify(sender.data, null, 3);
        console.log(sender.data);
        await axios.get(`http://localhost:5001`);
        const initialRes = await axios.post(`http://localhost:5001/storeUserSurvey`, { username: user.name, email: user.email, surveyData: sender.data });
        console.log(initialRes.data);
    });


    return (<Survey model={survey} />);
}

export default SurveyComponent;