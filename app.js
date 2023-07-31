const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

// Sample data for demonstration purposes
const projects = [];

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// Home Page
app.get('/', (req, res) => {
  res.render('home', { projects });
});

// Create Project Page
app.get('/create-project', (req, res) => {
  res.render('create-project');
});

// Project Detail Page
app.get('/projects/:id', (req, res) => {
  const projectId = req.params.id;
  const project = projects.find((p) => p.id === projectId);
  if (!project) {
    res.redirect('/');
  } else {
    res.render('project-detail', { project });
  }
});

// Create Issue Page
app.get('/projects/:id/create-issue', (req, res) => {
  const projectId = req.params.id;
  const project = projects.find((p) => p.id === projectId);
  if (!project) {
    res.redirect('/');
  } else {
    res.render('create-issue', { project });
  }
});

// POST route to create a new project
app.post('/create-project', (req, res) => {
  const { name, description, author } = req.body;
  const project = {
    id: Date.now().toString(),
    name,
    description,
    author,
    issues: [],
  };
  projects.push(project);
  res.redirect('/');
});

// POST route to create a new issue
app.post('/projects/:id/create-issue', (req, res) => {
  const projectId = req.params.id;
  const project = projects.find((p) => p.id === projectId);
  if (!project) {
    res.redirect('/');
  } else {
    const { title, description, labels, author } = req.body;
    const issue = {
      id: Date.now().toString(),
      title,
      description,
      labels: labels.split(',').map(label => label.trim()),
      author,
    };
    project.issues.push(issue);
    res.redirect(`/projects/${projectId}`);
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
