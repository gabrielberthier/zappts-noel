# zappts-noel
Teste técnico para a Zappts

## FUNCIONAMENTO DA API
-------
1. Crie um usuário via o endpoint (host)/api/sign-up/ ou fazendo login (host)/api/login/
2. Receba o TOKEN
3. Ponha no header (*x-access-token*) da próxima requisição para ter acesso aos recursos da API nos endpoints de letters

Endpoints:
- Listar: -GET api/letter/
- Criar: -POST api/letter/
- Deletar: -DELETE api/letter/{:id} 
- Atualizar: -PUT api/letter/{:id} 

**O Id deve estar no formato hex provido pelo Mongo (EX: 60bd66f0c1ed084730e168c4)**
