const TodoList = {

  tasks: [],

  init: function(){ // Recebe as funcoes da aplicação
    this.cacheSelectors() // TodoList.cacheSelectors()
    this.bindEvents()
    this.getStoraged() // Vai pegar os elementos armazenados no LS e por em um array
    this.buildTasks() // Exibe na tela os elementos salvos no lS
  },

  cacheSelectors: function(){ // Seleciona os elementos
    this.$checkButtons = document.querySelectorAll('.check')
    this.$inputTask = document.querySelector('#inputTask')
    this.$list = document.querySelector('.list')
    this.$removeButtons = document.querySelectorAll('.remove')
  },

  bindEvents: function(){ // Executa eventos sobre os elementos

    //console.log(this) // TodoList
    const self = this

    this.$checkButtons.forEach(function(button){
      //console.log(this) // Window
      button.addEventListener('click', self.Events.checkButton_click)
    })

    this.$inputTask.addEventListener('keypress', self.Events.inputTask_keypress.bind(self))

    this.$removeButtons.forEach(function(button){
      button.addEventListener('click', self.Events.removeButton_click.bind(self))
    })
  },

  getStoraged: function(){
    const tasks = localStorage.getItem('tasks')

    if(tasks){
      this.tasks = JSON.parse(tasks)
    }else{
      localStorage.setItem('tasks', JSON.stringify([]))
    }
    
  },

  getTaskHtml: function(task){
    return `
      <li>
        <div class="check"></div>
        <span class="task">${task}</span>
        <button class="remove"></button>
      </li>
  `
  },

  buildTasks: function(){
    let html = ''

    this.tasks.forEach((item) => {
      html += this.getTaskHtml(item.task)
    })

    this.$list.innerHTML = html
    this.cacheSelectors()
    this.bindEvents()
  },

  Events: { // Funções que vao ser executadas nos eventos (evento de click, evento de teclado etc.)
    checkButton_click: function(e){
      const li = e.target.parentElement // Me retorna o elemento pai do alvo(target) clicado
      const isDone = li.classList.contains('done') // Me retorna true ou false

      if(!isDone){
        return li.classList.add('done')
      }

      li.classList.remove('done')
    },

    inputTask_keypress: function(e){
      const key = e.key
      const taskValue = e.target.value

      if(key === 'Enter' && taskValue !== ''){
        this.$list.innerHTML += this.getTaskHtml(taskValue)
        e.target.value = ''
        
        this.cacheSelectors()
        this.bindEvents()

        const savedTasks = localStorage.getItem('tasks')
        const savedTasksObj = JSON.parse(savedTasks)

        const obj = [
          {task: taskValue},
          ...savedTasksObj
        ]

        this.tasks = obj
        localStorage.setItem('tasks', JSON.stringify(obj))
      }
    },

    removeButton_click: function(e){

      const li = e.target.parentElement
      const value = e.target.previousElementSibling.innerHTML

      const newTasksState = this.tasks.filter((item) => {
        return item.task !== value
      })

      localStorage.setItem('tasks', JSON.stringify(newTasksState))
      this.tasks = newTasksState
      
      li.classList.add('removed')

      setTimeout(() => {
        li.classList.add('hidden')
      },300)

    }
  }

}

TodoList.init()
