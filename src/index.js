import {Question} from 'C:/Users/Dmitriy/Desktop/Веб-разработка/PodcastsApp/src/questions.js'
import './styles.css'
import {isValid} from 'C:/Users/Dmitriy/Desktop/Веб-разработка/PodcastsApp/src/isValid.js'
import {openAuth} from 'C:/Users/Dmitriy/Desktop/Веб-разработка/PodcastsApp/src/openAuth.js'
import {getAuthForm, passMailAuth} from 'C:/Users/Dmitriy/Desktop/Веб-разработка/PodcastsApp/src/auth.js'

const askForm = document.getElementById('form')
const inputQuestionLabel = document.getElementById('questionInputBriefly')
const inputQuestionDetailed = document.getElementById('questionInputDetailed')
const submitButton = document.getElementById('submitButton')
const mainBtn = document.getElementById('mainBtn')

mainBtn.addEventListener('click', openMain)
window.addEventListener('load', Question.renderList)
askForm.addEventListener('submit', submitFormHandler)
inputQuestionLabel.addEventListener('input', () => {
    submitButton.disabled = !isValid(inputQuestionLabel.value)
})

function submitFormHandler(event){
    event.preventDefault()
    
    if (isValid(inputQuestionLabel.value)) {
        const question = {
            title: inputQuestionLabel.value.trim(),
            description: inputQuestionDetailed.value.trim(),
            date: new Date().toJSON()
        }
        submitButton.disabled = true
        Question.create(question).then( () => {
            inputQuestionLabel.value = ''
            inputQuestionDetailed.value = ''
            inputQuestionLabel.className = ''
            submitButton.disabled = false
        })
    }
}

function openMain(){
    openAuth('Авторизация', getAuthForm())
    document.getElementById('authForm').addEventListener('submit', authFormHandler, {once: true})
}

function authFormHandler(event){
    event.preventDefault()

    const btn = event.target.querySelector('button')
    const email = event.target.querySelector('#email').value
    const password = event.target.querySelector('#password').value

    btn.disabled = true
    passMailAuth(email, password)
        .then(Question.fetch)
        .then(renderAfterAuth)
        .then( () => btn.disabled = false )
}

function renderAfterAuth(content){
    if (typeof content === 'string'){
        openAuth('Ошибка!', content)
    } else {
        openAuth('Список вопросов:', Question.listToHTML(content))
    }
}