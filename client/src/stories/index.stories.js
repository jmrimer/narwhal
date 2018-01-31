import * as React from 'react';
import theme from '../themes/default';
import '../index.css';
import {EventFormStory} from "./EventForm.stories";

document.body.style.fontFamily = theme.fontFamily;
document.body.style.color = theme.fontColor;
document.body.style.fontFamily = 'sans-serif';
document.body.style.fontWeight = 300;

EventFormStory()