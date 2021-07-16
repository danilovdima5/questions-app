export class Question {
    static create(question){
        return fetch('https://podcastsquestions-a5098-default-rtdb.firebaseio.com/questions.json', {
            method: 'POST',
            body: JSON.stringify(question),
            headers: {
                'Content-type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(response => {
            question.id = response.name
            return question
        })
        .then(addToLS)
        .then(Question.renderList)
    }

    static fetch(token){
        if (!token) {
            return Promise.resolve('<p class="error">Пользователь не найден</p>')
        }
        return fetch(`https://podcastsquestions-a5098-default-rtdb.firebaseio.com/questions.json?auth=${token}`)
        .then(response=>response.json())
        .then(response => {
            if(response.error){
                return `<p class="error">${response.error}</p>`
            }

            return response
                ? Object.keys(response).map(key=>({...response[key], id: key}))
                : []
        })
    }

    static renderList(){
        const questions = getQsFromLS()

        const html = questions.length
            ? questions.map(toCard).join('')
            : '<div class="mui--text-headline">Вы пока ничего не спросили(( Давайте это исправим!!!</div>'

        const list = document.getElementById('list')
        list.innerHTML = html
    }

    static listToHTML(questions){
        return questions.length
            ? `<ol>${questions.map(q => `<li>${q.title} / ${q.description}</li>`).join('')}</ol>`
            : '<p>Вопросов нет</p>'
    }
}

function addToLS(question){
    const all = getQsFromLS()
    all.push(question)
    localStorage.setItem('questions', JSON.stringify(all))
}

function getQsFromLS(){
    return JSON.parse(localStorage.getItem('questions') || '[]')
}

function toCard(question){
    return `
        <div class="mui--text-black-54">
            ${new Date(question.date).toLocaleDateString()}
            ${new Date(question.date).toLocaleTimeString()}
        </div>
        <div>${question.title}</div>
        <div>${question.description}</div>
    `
}