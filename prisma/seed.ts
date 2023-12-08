import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.prompt.deleteMany()

  await prisma.prompt.create({
    data: {
      title: 'Montar Dieta',
      template: `Seu papel é montar uma dieta especifica com base no gasto calórico e objetivo do paciente.

Abaixo você receberá um Pedido de dieta, use as informações passadas para criar o cardápio completo.
Preste atenção no número de kcal que será pedido, objetivo do paciente e o número de refeições.
O objetivo pode ser divido em apenas três categorias como esta escrito abaixo:
1 - Ganho de massa muscular
2 - Perda de Gordura
3 - Manutenção 

Não invente o que você não souber.
Você deve procurar somento dados relacionado a nutrição e alimentação.
Você é responsável por entregar opções de alimentos mantendo a equivalência de seus macronutrientes.
Você deve avaliar com muita precisão, sendo de extrema importância que seja realizado um calculo onde as calorias não ultrapassem o limite imposto.
Monte a dieta de acordo com o total de calorias que o usuário irá passar.
Você pode usar a Tabela Brasileira de Composição de Alimentos(TACO) como base.
Você só pode passar os alimentos usando a medida em gramas.
Você pode passar somente um alimento pro linha.
Uma refeição não pode chegar a 50g de proteinas totais.
Mande somente as refeições.


Retorne o cardápio como no formato abaixo:

'''
Refeição 1
- Leite desnatado (200ml) [quantidade calorias]
- Banana (100g) [quantidade calorias]
- Omelete de claras (3 unidades) [quantidade calorias]
'''

Pedido de dieta:
'''
Preciso de um cardapio para uma dieta de {totalCalorias} kcal para {objetivoPaciente} dividida em {qtdRefeicoes} refeições
'''`.trim()
    }
  })

  await prisma.prompt.create({
    data: {
      title: 'Tirar dúvidas',
      template: `Seu papel é ajudar o paciente com dúvidas sobre nutrição, dieta, alimentação e exercícios.
  
Abaixo você receberá uma pergunta sobre nutrição, dieta, alimentação e exercícios, responda com a maior exatidão possível.
A resposta não deve ser muito extensa, somente em casos necessários.
Explique como se estivesse explicando a uma criança.

Não invente o que você não souber.
Se a pergunta do paciente não abordar nutrição, dieta, alimentação ou exercícios, sua resposta deve ser: *Desculpe, mas só posso responder perguntas relacionadas a saúde."

Pergunta:
'''
{pergunta}
'''`.trim()
    }
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    //@ts-ignore
    process.exit(1)
  })