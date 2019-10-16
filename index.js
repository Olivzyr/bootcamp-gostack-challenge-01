// Chamando o express para uma variável
const express = require('express');

// Iniciando o servidor chamando a função express
const server = express();

// Dizendo que será utilizado arquivos json nesse projeto
server.use(express.json());

// Criando um array de objeto
const projects = [{
  id: "0",
  title: 'Meu primeiro projeto',
  tasks: []
}];

// Criação dos Middlewares


// Contador para ser utilizado no middleware global
let reqCount = 0;

// Middleware Global que contabiliza a quantidade de requisições realizadas
server.use((req, res, next) => {

  next();
  reqCount++;
  console.log(`Número de requisições: ${reqCount}`);
  //console.log(reqCount);
})



// Middleware para controle de rotas que não possuem id
function checkIndexProject (req, res, next) {
  const indexProject = projects[req.params.id]

  if (!indexProject) {
    return res.status(400).json( { error:"The project doesn't exist, create a new project" });
  }

  return next();

}


// Insere projetos presente no body - INSERT
server.post('/projects', (req, res) => {
  // Recebendo as informações do body
  const { id,title } = req.body;
  
    // Estruturando o objeto novamente
    const project = {
      id,
      title,
      tasks: []
    
    }

  projects.push(project);

  return res.json(projects);
})


// Retorna todos os projetos - READ
server.get('/projects', (req, res) => {
   return res.json(projects);
})


// Altera informações do projeto - UPDATE
server.put('/projects/:id', checkIndexProject, (req, res) => {
  // Recebe o id da posição do array que deseja alterar
  const { id } = req.params;
  // Recebe o novo valor do body para substituir no array
  const { title } = req.body;
  
  const task = projects[id].tasks;

  const project = {
    id,
    title,
    tasks:task
  }
  
  projects[id] = project;

  return res.json(projects)  
})

// Rota para realizar o delete do projeto - DELETE
server.delete('/projects/:id', checkIndexProject, (req, res) => {
  const { id } = req.params;
  // **************************************************//
  const projectIndex = projects.findIndex(p => p.id == id);
  // **************************************************//
  
  projects.splice(projectIndex, 1);
  

  return res.json(projects);

})

server.post('/projects/:id/tasks', checkIndexProject, (req,res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects[id].tasks.push(title);

  return res.json(projects)
})


// Porta do servidor
server.listen(3000);