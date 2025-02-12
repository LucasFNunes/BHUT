# BHUT

Esta é uma aplicação Node.js com TypeScript que gerencia a criação de carros, utiliza Redis para armazenamento de logs e Bull para processamento de filas. A aplicação também envia webhooks para notificar sobre a criação de novos carros.

🛠️ Tecnologias Utilizadas

    Node.js: Ambiente de execução JavaScript.

    TypeScript: Superset de JavaScript com tipagem estática.

    Express: Framework para construção de APIs RESTful.

    Redis: Banco de dados NoSQL para armazenamento de logs.

    Bull: Biblioteca para gerenciamento de filas baseadas em Redis.

    Axios: Cliente HTTP para fazer requisições à API externa.

    Swagger: Documentação da API.

    
# 🚀 Como rodar o projeto localmente

Siga estas instruções para configurar e executar o projeto no seu ambiente local.
Pré-requisitos:

Certifique-se de ter instalado no seu sistema:

    Node.js (recomendado: versão LTS)
    Docker e Docker Compose
    Git (para clonar o repositório)

1. Clone o repositório

Clone o repositório para sua máquina local e navegue até a pasta do projeto:

git clone [https://github.com/LucasFNunes/teste-backend.git](https://github.com/LucasFNunes/BHUT.git)
cd BHUT

2. Configure o ambiente

Crie um arquivo .env na raiz do projeto com as seguintes variáveis:

Configurações da API externa, não colocarei os valores reais por motivos de segurança, mas pode ser utilizado a mesma disponibilizada para que eu pudesse realizar esta aplicação 
```
API_LINK=http://APILINKAQUI/api
API_LOGIN_USER=LOGINAQUI
API_LOGIN_PASSWORD=SENHAAQUI

```

Porta em que o servidor rodará
PORT=3000

3. Instale as dependências

Use o gerenciador de pacotes npm ou yarn para instalar as dependências do projeto:

npm install

4. Inicie o Servidor Redis

Certifique-se de que o Redis está rodando. Usando Docker, você pode iniciar um container com o seguinte comando:

docker run -d --name redis -p 6379:6379 redis

Isso criará um contêiner com o banco de dados PostgreSQL configurado para uso com o projeto.

5. Inicie o servidor

Inicie o servidor localmente:

npm run dev

O servidor estará rodando em http://localhost:3000.

# 🐳 Rodando o projeto com Docker

Executar a aplicação e o Redis usando Docker:

    docker-compose up --build

    Acesse a aplicação em http://localhost:3000.
    
# 🛠️ Endpoints Disponíveis

🛠️  auth/login

O Login será realizado automaticamente ao requisitar qualquer rota com as credenciais criadas em meu nome,, caso seja realizada dentro do tempo limite para o login expirar usarei o RefreshToken para atualizar este tempo, caso já tiver expirado do Redis, será realizado um novo login, tudo automatizado portanto não precisa se preocupar :)


🛠️ Car

1. Criando um Carro

    POST API_URL/car/
    Body:

```
{
  "nome": "Etios",
  "marca": "Toyota",
  "preco": 49999.99,
  "anoFabricacao": 2013
}

```

    
Resposta:

    {
      "id": "AAAAA-AAAA-AAAAA-AAAAA-AAAAAAAAAAA"
    }

2. Encontrar todos os carros criados

    GET API_URL/car/
    
Resposta:

    {
	"paginacao": {
		"pagina": 1,
		"tamanhoPagina": 500,
		"total": 6
	},
	"itens": [
		{
			"id": "1caeb994-4b52-420e-8aa2-322087ff900a",
			"nome": "Etios",
			"marca": "Toyota",
			"preco": 49999.99,
			"anoFabricacao": 2016,
			"ativo": true,
			"criadoEm": "2025-02-11 10:10:21",
			"atualizadoEm": null
		}
	]


3. Deletar um carro

    DELETE API_URL/car/
    Resposta:
```
    {
      "message": "Carro deletado com sucesso."
    }
```


🛠️ LOGS

1. Encontrar todos os logs criados

    GET API_URL/car/

    
Resposta:

    [
	{
		"id": "2",
		"car_id": "AAAAAAAA-AAA-AAAA-9755-AAAAAAAAAAA",
		"data_hora_criacao": "2025-02-11T15:53:50.519Z",
		"data_hora_processamento": "2025-02-11T19:43:44.913Z"
	}
]



🧠 Fluxo da Aplicação

    Criação de Carro:

        O usuário faz uma requisição POST para /api/car.

        A aplicação cria o carro na API externa e adiciona uma mensagem à fila.

    Processamento da Fila:

        O Bull processa a mensagem da fila.

        Envia um webhook com os dados do carro.

        Salva um log no Redis.

    Consulta de Logs:

        O usuário faz uma requisição GET para /api/logs.

        A aplicação retorna todos os logs salvos no Redis.
        
    Consulta de Carros:

        O usuário faz uma requisição GET para /api/car.

        A aplicação retorna todos os carros salvos na aplicação.
        
# 🧪 Rodando os Testes

Execute os testes com o comando:

```
npx jest ou npx jest --coverage

```

# 🧪 Documentação com swagger

Execute a documentação com o servidor ativo pelo link:
```
http://localhost:3000/api-docs
```


# 📝 Contribuição

Sinta-se à vontade para abrir issues e pull requests. Toda contribuição é bem-vinda!

