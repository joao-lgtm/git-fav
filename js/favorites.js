import { GithubUser } from "./githubUser.js"

export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    }

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }



    async add(username) {
        try {

            const userExists = this.entries.find(entry => entry.login === username)


            if(userExists) {
                throw new Error('Usuario ja cadastrado')
            }

            const user = await GithubUser.search(username)
            if (user.login === undefined) {
                throw new Error('Usuario nao encontrado')
            }

            this.entries = [user, ...this.entries]
            this.update()
            this.save()
        } catch (error) {
            alert(error.message)
        }
    }

    delete(user) {
        const filteredEntries = this.entries
            .filter(entry => {
                entry.login !== user.login
            })

        this.entries = filteredEntries
        this.update()
        this.save()
    }
}



export class Favoritesview extends Favorites {
    constructor(root) {
        super(root)

        this.tbody = this.root.querySelector('table tbody')

        this.update()
        this.onadd()
    }

    onadd() {
        const addButton = this.root.querySelector('.search button')
        addButton.onclick = () => {
            const { value } = this.root.querySelector('.search input')

            this.add(value)
        }
    }

    update() {
        this.removeAllTr()

        this.entries.forEach(user => {
            const row = this.createRow()

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `imagem de ${user.name}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.Repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers

            row.querySelector('.remove').onclick = () => {
                const isOk = confirm('tem certeza que deseja deletar essa linah?')
                if (isOk) {
                    this.delete(user)
                }
            }

            this.tbody.appendChild(row)
        })
    }

    createRow() {
        const tr = document.createElement('tr')

        tr.innerHTML = `
            <td class="user">
                <img src="https://github.com/joao-lgtm.png" alt="imagem de joao" />
                <a href="https://github.com/joao-lgtm" target="_blank">
                    <p>Joao Paulo Cassatti</p>
                    <span>joao-lgtm</span>
                </a>
            </td>
            <td class="Repositories">1</td>
            <td class="followers">3</td>
            <td>
                <button class="remove">&times;</button>
            </td>
        `

        return tr
    }

    removeAllTr() {
        this.tbody.querySelectorAll('tr')
            .forEach((tr) => {
                tr.remove()
            })
    }
}