export function openAuth(title, content){
    const authWindow = document.createElement('div')
    authWindow.classList.add('modal')

    authWindow.innerHTML = `
        <h1>${title}</h1>
        <div class="auth-content">${content}</div>
    `
    mui.overlay('on', authWindow)
}