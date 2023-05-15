import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'
import {Container, Card, Button} from 'react-bootstrap'

function App() {

  const [livros, setLivros] = useState([]);
  const [newLivro, setNewLivro] = useState(
    {
      title: "",
      author: "", 
      edicao: "",
      editora: "",
      pages: "",
      anoPublicacao: ""
    }
  )

  //Iniciando a Conexão com Db e setando os dados em livros
  useEffect(() => {
    axios.get("http://localhost:3000/livros")
    .then((response) => {
      setLivros(response.data.livros);
    })
    .catch((err) => {
      console.log(err);
    })
  }, []);

//Função para deletar livro
  const handleDelete = (id) => {

    if(window.confirm("Tem certeza que deseja remover este livro?")){

      axios.delete(`http://localhost:3000/livros/${id}`)
      .then(() => {
        setLivros(livros.filter((livro) => livro.id !== id)) 
      })
      .catch((err) => console.log(err));

    }

  }

//Função para obter os valores dos inputs
  function handleChange(event){

    const {name,value} = event.target;

    setNewLivro({...newLivro, [name]: value});
  }

//Função para inserir um novo livro
  function handleSubmit(event){
    event.preventDefault();
    
    axios.post(`http://localhost:3000/livros`, newLivro)
    .then((response) => {
      setLivros([...livros, {id: response.data.id, ...newLivro}])
      setNewLivro({
        title: "",
        author: "", 
        edicao: "",
        editora: "",
        pages: "",
        anoPublicacao: ""
      })
    })
    .catch((err) => console.log(err));
  }

  return (
    <>
    <div className="header-livros">
      <h1>Cadastro de Livros</h1>
    </div>
    <Container>
      <h2>Novo Livro</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Título do Livro</label>
          <input
            type="text"
            name='title'
            className='form-control'
            id='title'
            value={newLivro.title}
            onChange={handleChange}
            placeholder='Ex: Lógica de programação e Algoritmo com Javascript'
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="author">Autor</label>
          <input
            type="text"
            name='author'
            className='form-control'
            id='author'
            value={newLivro.author}
            onChange={handleChange}
            placeholder='Edécio Fernando Lepsen'
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="edicao">Edição</label>
          <input
            type="text"
            name='edicao'
            className='form-control'
            id='edicao'
            value={newLivro.edicao}
            onChange={handleChange}
            placeholder='1 edição'
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="editora">Editora</label>
          <input
            type="text"
            name='editora'
            className='form-control'
            id='editora'
            value={newLivro.editora}
            onChange={handleChange}
            placeholder='Novatec'
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="pages">Número de páginas</label>
          <input
            type="number"
            name='pages'
            className='form-control'
            id='pages'
            value={newLivro.pages}
            onChange={handleChange}
            placeholder='100'
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="anoPublicacao"> Ano de publicação</label>
          <input
            type="number"
            name='anoPublicacao'
            className='form-control'
            id='name'
            value={newLivro.anoPublicacao}
            onChange={handleChange}
            placeholder='2023'
            required 
          />
        </div>
        <button type='submit' className='btn btn-primary mt-3'>Adicionar Livro</button>
      </form>
    </Container>
    <Container className='cont'>
      <hr />
      <div className="row">
        {livros.map((livro) => (
          <div className="col-md-4" key={livro.id}>
            <Card className='card'>
              <Card.Body>
                <Card.Title className='title'>{livro.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  Autor: {livro.author} 
                </Card.Subtitle>
                <Card.Text className='mb-1'>Ed: {livro.edicao}</Card.Text>
                <Card.Text className='mb-1'>Editora: {livro.editora}</Card.Text>
                <Card.Text className='mb-1'>Páginas: {livro.pages}</Card.Text>
                <Card.Text>Ano de Publicação: {livro.anoPublicacao}</Card.Text>
                <Button variant='danger' onClick={() => handleDelete(livro.id)}>Remover</Button>
                <Button className='button-edit'>Editar</Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </Container>
    </>
  )
}

export default App
