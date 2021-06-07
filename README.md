# zappts-noel
Teste técnico para a Zappts

## FUNCIONAMENTO DA API

Crie um usuário via o endpoint (host)/api/sign-up/ ou fazendo login (host)/api/login/
Receba o TOKEN
Ponha no header da próxima requisição para ter acesso aos recursos da API nos endpoints de letters

Endpoints:
Listar: -GET api/letter/
Criar: -POST api/letter/
Deletar: -DELETE api/letter/{:id} 
Atualizar: -PUT api/letter/{:id} 

**O Id deve estar no formato hex provido pelo Mongo (EX: 60bd66f0c1ed084730e168c4)**
